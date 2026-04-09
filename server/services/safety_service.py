import re

class ScoringService:
    def calculate_status(self, value, ref_min, ref_max):
        """
        Implements the Severity Logic (Scoring State Machine).
        """
        if ref_min is None or ref_max is None:
            return "Amber" # Default to careful monitor if ranges are missing
            
        range_width = ref_max - ref_min
        
        # Optimal (Green): Within range or within 2% of the boundary
        if ref_min * 0.98 <= value <= ref_max * 1.02:
            return "Green"
            
        # Monitor (Amber): 3% to 15% deviation
        deviation_min = (ref_min - value) / ref_min if value < ref_min else 0
        deviation_max = (value - ref_max) / ref_max if value > ref_max else 0
        max_dev = max(deviation_min, deviation_max)
        
        if max_dev <= 0.15:
            return "Amber"
            
        # Consult (Orange): >15% deviation
        return "Orange"

class WatchdogAgent:
    def __init__(self):
        self.forbidden_terms = ["death", "fatal", "terminal", "cancer", "dying"]
        
    def sanitize_output(self, text):
        """
        Intercepts and rewrites alarmist language to be clinically accurate but patient-friendly.
        """
        sanitized = text
        
        # Replacement map for common alarmist terms
        replacements = {
            r"\bdeath\b": "critical outcome",
            r"\bfatal\b": "severe clinical impact",
            r"\bterminal\b": "advanced stage",
            r"\bcancer\b": "cellular irregularity requiring specialist review",
        }
        
        for pattern, replacement in replacements.items():
            sanitized = re.sub(pattern, replacement, sanitized, flags=re.IGNORECASE)
            
        return sanitized

scoring_service = ScoringService()
watchdog = WatchdogAgent()
