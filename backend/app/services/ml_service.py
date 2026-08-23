from typing import Dict, Any, List, Tuple
import math

class MLService:
    """
    ML Service for predicting recovery probabilities, purchase intent, and providing explainability.
    In Demo mode, uses deterministic ML fallback logic to simulate real model outputs.
    """
    
    @staticmethod
    def predict_recovery_probability(features: Dict[str, Any]) -> Tuple[float, List[str], List[str]]:
        """
        Predicts probability of recovering a failed payment.
        Returns: (probability, positive_factors, negative_factors)
        """
        base_prob = 0.50
        pos_factors = []
        neg_factors = []
        
        # Feature: Customer Lifetime Value (CLV)
        clv = features.get('customer_lifetime_value', 0)
        if clv > 10000:
            base_prob += 0.15
            pos_factors.append("High customer lifetime value")
        elif clv < 1000:
            base_prob -= 0.05
            neg_factors.append("Low historical value")
            
        # Feature: Root Cause
        root_cause = features.get('root_cause', '')
        if root_cause in ['TEMPORARY_BANK_FAILURE', 'NETWORK_TIMEOUT']:
            base_prob += 0.20
            pos_factors.append("Failure is likely temporary/technical")
        elif root_cause == 'INSUFFICIENT_FUNDS':
            base_prob -= 0.15
            neg_factors.append("Customer has insufficient funds")
        elif root_cause == 'HIGH_RISK_BLOCKED':
            base_prob -= 0.40
            neg_factors.append("Transaction blocked for high risk")
            
        # Feature: Previous Failure Count
        failures = features.get('previous_failures', 0)
        if failures == 0:
            base_prob += 0.05
            pos_factors.append("Strong payment history")
        elif failures > 2:
            base_prob -= 0.15
            neg_factors.append("Repeated payment failures recently")
            
        # Bound probability between 0.01 and 0.99
        prob = max(0.01, min(0.99, base_prob))
        return round(prob, 2), pos_factors, neg_factors

    @staticmethod
    def predict_purchase_intent(features: Dict[str, Any]) -> Tuple[float, List[str], List[str]]:
        """
        Predicts purchase intent for checkout abandonment.
        """
        base_intent = 0.40
        pos_factors = []
        neg_factors = []
        
        cart_value = features.get('cart_value', 0)
        time_on_checkout = features.get('time_on_checkout', 0)
        
        if time_on_checkout > 120:
            base_intent += 0.25
            pos_factors.append("High time spent on checkout")
        elif time_on_checkout < 10:
            base_intent -= 0.20
            neg_factors.append("Bounced almost immediately")
            
        if cart_value > 5000:
            base_intent += 0.10
            pos_factors.append("High value cart intent")
            
        prob = max(0.01, min(0.99, base_intent))
        return round(prob, 2), pos_factors, neg_factors

    @staticmethod
    def predict_payment_probability(features: Dict[str, Any]) -> Tuple[float, List[str], List[str]]:
        """
        Predicts payment probability for overdue B2B receivables.
        """
        base_prob = 0.70
        pos_factors = []
        neg_factors = []
        
        days_overdue = features.get('days_overdue', 0)
        promise_kept_rate = features.get('promise_kept_rate', 0.5)
        
        if days_overdue < 7:
            base_prob += 0.10
            pos_factors.append("Invoice is only recently overdue")
        elif days_overdue > 60:
            base_prob -= 0.30
            neg_factors.append("Invoice is severely aged (>60 days)")
            
        if promise_kept_rate > 0.8:
            base_prob += 0.15
            pos_factors.append("Customer historically keeps promises")
        elif promise_kept_rate < 0.2:
            base_prob -= 0.20
            neg_factors.append("Customer historically breaks promises")
            
        prob = max(0.01, min(0.99, base_prob))
        return round(prob, 2), pos_factors, neg_factors

ml_service = MLService()
