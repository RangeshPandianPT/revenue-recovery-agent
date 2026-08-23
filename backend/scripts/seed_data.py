import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine
from app.models.domain import (
    Merchant, User, Customer, Transaction, Invoice,
    RecoveryOpportunity, EventType, RecoveryStatus,
    StrategyType, UserRole
)
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurable scale
NUM_CUSTOMERS = 10000
NUM_TRANSACTIONS = 30000
NUM_INVOICES = 20000

def get_random_date(start_date: datetime, end_date: datetime):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    if days_between_dates <= 0:
        return start_date
    random_number_of_days = random.randrange(days_between_dates)
    return start_date + timedelta(days=random_number_of_days)

def seed_data():
    db = SessionLocal()
    
    # Clean existing
    logger.info("Cleaning existing data...")
    for table in [RecoveryOpportunity, Invoice, Transaction, Customer, User, Merchant]:
        db.query(table).delete()
    db.commit()

    logger.info("Creating Merchant and Admin User...")
    merchant = Merchant(name="Demo Merchant Ltd")
    db.add(merchant)
    db.commit()

    admin = User(
        email="admin@merchant.com",
        hashed_password="fakehashedpassword",
        role=UserRole.ADMIN,
        merchant_id=merchant.id
    )
    db.add(admin)
    db.commit()

    logger.info(f"Generating {NUM_CUSTOMERS} customers...")
    customers = []
    for i in range(NUM_CUSTOMERS):
        customers.append(Customer(
            merchant_id=merchant.id,
            name=f"Customer {i}",
            email=f"customer{i}@example.com",
            phone=f"+91{random.randint(7000000000, 9999999999)}",
            lifetime_value=random.uniform(100, 100000),
            segment=random.choice(["VIP", "HIGH_INTENT", "REGULAR", "AT_RISK", "LOW_INTENT"]),
            created_at=datetime.utcnow() - timedelta(days=random.randint(10, 365))
        ))
    db.bulk_save_objects(customers)
    db.commit()
    
    # Reload customers to get IDs
    customers = db.query(Customer).all()
    customer_ids = [c.id for c in customers]
    
    logger.info(f"Generating {NUM_TRANSACTIONS} transactions...")
    transactions = []
    opportunities = []
    
    now = datetime.utcnow()
    start_date = now - timedelta(days=180)
    
    for i in range(NUM_TRANSACTIONS):
        c_id = random.choice(customer_ids)
        amount = random.uniform(500, 50000)
        status = random.choice(["SUCCESS", "FAILED", "FAILED", "SUCCESS", "SUCCESS"]) # 40% failure
        t_date = get_random_date(start_date, now)
        
        t = Transaction(
            customer_id=c_id,
            amount=amount,
            status=status,
            root_cause="INSUFFICIENT_FUNDS" if status == "FAILED" else None,
            created_at=t_date
        )
        transactions.append(t)
        
    db.bulk_save_objects(transactions)
    db.commit()

    # Generate opportunities from failed transactions
    failed_txns = db.query(Transaction).filter(Transaction.status == "FAILED").all()
    logger.info(f"Generating recovery opportunities from {len(failed_txns)} failed transactions...")
    for t in failed_txns:
        opp = RecoveryOpportunity(
            merchant_id=merchant.id,
            customer_id=t.customer_id,
            transaction_id=t.id,
            type=random.choice([EventType.PAYMENT_FAILURE, EventType.CHECKOUT_ABANDONMENT, EventType.SUBSCRIPTION_FAILURE]),
            amount=t.amount,
            recovery_probability=random.uniform(0.1, 0.95),
            expected_recovery=t.amount * random.uniform(0.1, 0.95),
            recommended_action=random.choice(list(StrategyType)),
            status=random.choice(list(RecoveryStatus)),
            created_at=t.created_at
        )
        opportunities.append(opp)
        
    db.bulk_save_objects(opportunities)
    db.commit()
    
    logger.info(f"Generating {NUM_INVOICES} invoices...")
    invoices = []
    invoice_opps = []
    
    for i in range(NUM_INVOICES):
        c_id = random.choice(customer_ids)
        amount = random.uniform(1000, 200000)
        status = random.choice(["PAID", "OVERDUE", "PENDING"])
        due_date = get_random_date(start_date, now + timedelta(days=30))
        
        inv = Invoice(
            customer_id=c_id,
            amount=amount,
            due_date=due_date,
            status=status,
            created_at=due_date - timedelta(days=30)
        )
        invoices.append(inv)
        
    db.bulk_save_objects(invoices)
    db.commit()
    
    overdue_invs = db.query(Invoice).filter(Invoice.status == "OVERDUE").all()
    logger.info(f"Generating recovery opportunities from {len(overdue_invs)} overdue invoices...")
    for inv in overdue_invs:
        opp = RecoveryOpportunity(
            merchant_id=merchant.id,
            customer_id=inv.customer_id,
            invoice_id=inv.id,
            type=EventType.OVERDUE_RECEIVABLE,
            amount=inv.amount,
            recovery_probability=random.uniform(0.1, 0.95),
            expected_recovery=inv.amount * random.uniform(0.1, 0.95),
            recommended_action=StrategyType.REMINDER,
            status=RecoveryStatus.PENDING,
            created_at=inv.due_date
        )
        invoice_opps.append(opp)
        
    db.bulk_save_objects(invoice_opps)
    db.commit()

    logger.info("Seed data complete!")
    logger.info(f"Total customers: {db.query(Customer).count()}")
    logger.info(f"Total transactions: {db.query(Transaction).count()}")
    logger.info(f"Total invoices: {db.query(Invoice).count()}")
    logger.info(f"Total opportunities: {db.query(RecoveryOpportunity).count()}")
    
    db.close()

if __name__ == "__main__":
    seed_data()
