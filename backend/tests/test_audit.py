import pytest

def test_get_audit_logs(client):
    response = client.get("/api/audit")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)

def test_create_audit_log(client):
    payload = {
        "merchant_id": "merch_123",
        "actor": "TEST_AGENT",
        "action": "TEST_ACTION",
        "reason": "Testing the endpoint"
    }
    response = client.post("/api/audit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["actor"] == "TEST_AGENT"
    assert data["action"] == "TEST_ACTION"
