from typing import Dict, Any, Optional
from datetime import datetime

class RiskEngine:
    """
    Core engine for classifying revenue-risk events and diagnosing root causes.
    """
    
    @staticmethod
    def classify_event(event_data: Dict[str, Any]) -> str:
        """
        Classifies the type of revenue risk based on event payload.
        """
        if event_data.get('type') == 'payment.failed':
            if event_data.get('is_subscription', False):
                return 'SUBSCRIPTION_FAILURE'
            return 'PAYMENT_FAILURE'
            
        elif event_data.get('type') == 'checkout.abandoned':
            return 'CHECKOUT_ABANDONMENT'
            
        elif event_data.get('type') == 'invoice.overdue':
            return 'OVERDUE_RECEIVABLE'
            
        return 'UNKNOWN'

    @staticmethod
    def diagnose_root_cause(event_type: str, context: Dict[str, Any]) -> str:
        """
        Diagnoses the root cause based on contextual intelligence.
        """
        if event_type in ['PAYMENT_FAILURE', 'SUBSCRIPTION_FAILURE']:
            error_code = context.get('error_code', '')
            error_desc = context.get('error_description', '').lower()
            
            if 'insufficient' in error_desc or error_code == 'BAD_REQUEST_ERROR':
                return 'INSUFFICIENT_FUNDS'
            elif 'timeout' in error_desc or 'network' in error_desc:
                return 'NETWORK_TIMEOUT'
            elif 'bank' in error_desc or 'issuer' in error_desc:
                return 'TEMPORARY_BANK_FAILURE'
            elif 'card' in error_desc and 'expired' in error_desc:
                return 'CARD_EXPIRED'
            elif 'fraud' in error_desc or 'blocked' in error_desc:
                return 'HIGH_RISK_BLOCKED'
            return 'GENERIC_FAILURE'
            
        elif event_type == 'CHECKOUT_ABANDONMENT':
            time_on_page = context.get('time_on_page', 0)
            if time_on_page < 10:
                return 'LOW_INTENT_BOUNCE'
            elif context.get('payment_attempts', 0) > 0:
                return 'PAYMENT_FRICTION'
            return 'UNDECIDED_CUSTOMER'
            
        elif event_type == 'OVERDUE_RECEIVABLE':
            days_overdue = context.get('days_overdue', 0)
            previous_promises = context.get('previous_promises', 0)
            
            if previous_promises > 0:
                return 'BROKEN_PROMISE'
            if days_overdue > 30:
                return 'PROLONGED_DELINQUENCY'
            return 'MISSED_DEADLINE'
            
        return 'UNKNOWN'

risk_engine = RiskEngine()
