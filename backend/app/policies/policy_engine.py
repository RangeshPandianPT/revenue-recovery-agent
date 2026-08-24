from datetime import datetime, timedelta
from typing import Dict, Any, Tuple
from app.models.domain import Policy, StrategyType

class PolicyDecision:
    def __init__(self, allowed: bool, reason: str = ""):
        self.allowed = allowed
        self.reason = reason

class PolicyEngine:
    def validate_action(self, action: StrategyType, context: Dict[str, Any], policy: Policy) -> PolicyDecision:
        """
        Validates if an action is permitted by the policy.
        """
        if action == StrategyType.SMART_RETRY:
            retries = context.get("retries_count", 0)
            if retries >= policy.max_payment_retries:
                return PolicyDecision(False, f"Max payment retries ({policy.max_payment_retries}) reached.")
        
        if action in [StrategyType.REMINDER, StrategyType.PAYMENT_LINK]:
            messages = context.get("messages_count", 0)
            if messages >= policy.max_customer_messages:
                return PolicyDecision(False, f"Max customer messages ({policy.max_customer_messages}) reached.")
                
        if action == StrategyType.INCENTIVE:
            incentive_percent = context.get("incentive_percent", 0.0)
            if incentive_percent > policy.max_incentive_percent:
                return PolicyDecision(False, f"Incentive ({incentive_percent}%) exceeds maximum allowed ({policy.max_incentive_percent}%).")
                
        time_elapsed = context.get("time_elapsed_hours", 0)
        if time_elapsed > policy.max_recovery_window_hours:
            return PolicyDecision(False, f"Recovery window ({policy.max_recovery_window_hours}h) expired.")
            
        recovery_prob = context.get("recovery_probability", 1.0)
        if recovery_prob < policy.min_recovery_probability:
             return PolicyDecision(False, f"Recovery probability ({recovery_prob:.2f}) below minimum ({policy.min_recovery_probability}).")
             
        return PolicyDecision(True, "Action permitted by policy.")

    def check_stop_conditions(self, context: Dict[str, Any], policy: Policy) -> Tuple[bool, str]:
        """
        Checks if workflow should be stopped automatically.
        """
        if context.get("is_paid", False):
            return True, "Payment successful."
            
        if context.get("opt_out", False):
            return True, "Customer opted out."
            
        time_elapsed = context.get("time_elapsed_hours", 0)
        if time_elapsed > policy.max_recovery_window_hours:
            return True, "Recovery window expired."
            
        # Stop if BOTH max retries and max messages reached
        retries = context.get("retries_count", 0)
        messages = context.get("messages_count", 0)
        if retries >= policy.max_payment_retries and messages >= policy.max_customer_messages:
            return True, "Maximum retry and communication limits reached."
            
        return False, ""
        
    def check_escalation(self, context: Dict[str, Any], policy: Policy) -> Tuple[bool, str]:
        """
        Checks if case should be escalated to human queue.
        """
        amount = context.get("amount", 0.0)
        if amount >= policy.high_value_escalation_threshold:
            return True, f"High value transaction (>= {policy.high_value_escalation_threshold})."
            
        if context.get("customer_dispute", False):
            return True, "Customer disputes payment."
            
        if context.get("human_support_requested", False):
            return True, "Customer requested human support."
            
        return False, ""
