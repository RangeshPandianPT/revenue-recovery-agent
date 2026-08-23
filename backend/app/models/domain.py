import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Enum as SQLEnum, JSON, Text
from sqlalchemy.orm import relationship
import enum

from .base import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    MERCHANT = "MERCHANT"
    AGENT = "AGENT"

class EventType(str, enum.Enum):
    PAYMENT_FAILURE = "PAYMENT_FAILURE"
    CHECKOUT_ABANDONMENT = "CHECKOUT_ABANDONMENT"
    SUBSCRIPTION_FAILURE = "SUBSCRIPTION_FAILURE"
    OVERDUE_RECEIVABLE = "OVERDUE_RECEIVABLE"

class RecoveryStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    RECOVERED = "RECOVERED"
    FAILED = "FAILED"
    ESCALATED = "ESCALATED"
    STOPPED = "STOPPED"

class PromiseStatus(str, enum.Enum):
    PENDING = "PENDING"
    KEPT = "KEPT"
    BROKEN = "BROKEN"
    CANCELLED = "CANCELLED"
    ESCALATED = "ESCALATED"

class StrategyType(str, enum.Enum):
    SMART_RETRY = "SMART_RETRY"
    PAYMENT_LINK = "PAYMENT_LINK"
    REMINDER = "REMINDER"
    PROMISE_TO_PAY = "PROMISE_TO_PAY"
    INCENTIVE = "INCENTIVE"
    ESCALATE = "ESCALATE"

class Merchant(Base):
    __tablename__ = "merchants"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    customers = relationship("Customer", back_populates="merchant")
    policies = relationship("Policy", back_populates="merchant")

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.MERCHANT)
    merchant_id = Column(String, ForeignKey("merchants.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class Customer(Base):
    __tablename__ = "customers"
    id = Column(String, primary_key=True, default=generate_uuid)
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False)
    name = Column(String)
    email = Column(String, index=True)
    phone = Column(String)
    lifetime_value = Column(Float, default=0.0)
    segment = Column(String) # VIP, HIGH_INTENT, REGULAR, AT_RISK, LOW_INTENT
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="customers")
    transactions = relationship("Transaction", back_populates="customer")
    invoices = relationship("Invoice", back_populates="customer")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, default=generate_uuid)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    status = Column(String, nullable=False) # FAILED, SUCCESS, PENDING
    root_cause = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="transactions")
    recovery_case = relationship("RecoveryOpportunity", back_populates="transaction", uselist=False)

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(String, primary_key=True, default=generate_uuid)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(DateTime, nullable=False)
    status = Column(String, nullable=False) # PAID, OVERDUE, PENDING
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="invoices")

class RecoveryOpportunity(Base):
    __tablename__ = "recovery_opportunities"
    id = Column(String, primary_key=True, default=generate_uuid)
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=True)
    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=True)
    
    type = Column(SQLEnum(EventType), nullable=False)
    amount = Column(Float, nullable=False)
    recovery_probability = Column(Float)
    expected_recovery = Column(Float)
    recommended_action = Column(SQLEnum(StrategyType))
    status = Column(SQLEnum(RecoveryStatus), default=RecoveryStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    transaction = relationship("Transaction", back_populates="recovery_case")
    actions = relationship("RecoveryAction", back_populates="opportunity")

class RecoveryAction(Base):
    __tablename__ = "recovery_actions"
    id = Column(String, primary_key=True, default=generate_uuid)
    opportunity_id = Column(String, ForeignKey("recovery_opportunities.id"), nullable=False)
    action_type = Column(SQLEnum(StrategyType), nullable=False)
    status = Column(String) # SUCCESS, FAILED
    cost = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    opportunity = relationship("RecoveryOpportunity", back_populates="actions")

class PromiseToPay(Base):
    __tablename__ = "promises_to_pay"
    id = Column(String, primary_key=True, default=generate_uuid)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=True)
    amount = Column(Float, nullable=False)
    promise_date = Column(DateTime, nullable=False)
    status = Column(SQLEnum(PromiseStatus), default=PromiseStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

class Escalation(Base):
    __tablename__ = "escalations"
    id = Column(String, primary_key=True, default=generate_uuid)
    opportunity_id = Column(String, ForeignKey("recovery_opportunities.id"), nullable=False)
    reason = Column(String, nullable=False)
    priority = Column(String, default="MEDIUM") # HIGH, MEDIUM, LOW
    status = Column(String, default="OPEN") # OPEN, CLOSED
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, default=generate_uuid)
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False)
    opportunity_id = Column(String, ForeignKey("recovery_opportunities.id"), nullable=True)
    actor = Column(String, nullable=False) # AI_AGENT, ADMIN, SYSTEM
    action = Column(String, nullable=False)
    reason = Column(Text)
    policy_decision = Column(String)
    outcome = Column(String)
    revenue_impact = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Policy(Base):
    __tablename__ = "policies"
    id = Column(String, primary_key=True, default=generate_uuid)
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False)
    max_payment_retries = Column(Integer, default=2)
    max_customer_messages = Column(Integer, default=2)
    max_recovery_window_hours = Column(Integer, default=72)
    max_incentive_percent = Column(Float, default=5.0)
    min_recovery_probability = Column(Float, default=0.30)
    high_value_escalation_threshold = Column(Float, default=50000.0)
    
    merchant = relationship("Merchant", back_populates="policies")

class RecoveryBatch(Base):
    __tablename__ = "recovery_batches"
    id = Column(String, primary_key=True, default=generate_uuid)
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False)
    total_cases = Column(Integer, default=0)
    revenue_at_risk = Column(Float, default=0.0)
    recoverable_cases = Column(Integer, default=0)
    actions_executed = Column(Integer, default=0)
    successful_recoveries = Column(Integer, default=0)
    gross_revenue_recovered = Column(Float, default=0.0)
    recovery_costs = Column(Float, default=0.0)
    net_revenue_recovered = Column(Float, default=0.0)
    status = Column(String, default="PENDING") # PENDING, PROCESSING, COMPLETED, FAILED
    created_at = Column(DateTime, default=datetime.utcnow)

class BatchCase(Base):
    __tablename__ = "batch_cases"
    id = Column(String, primary_key=True, default=generate_uuid)
    batch_id = Column(String, ForeignKey("recovery_batches.id"), nullable=False)
    opportunity_id = Column(String, ForeignKey("recovery_opportunities.id"), nullable=False)
    status = Column(String, default="PENDING")

