from fastapi.testclient import TestClient

from main import app, load_rules, screen_project, Project

client = TestClient(app)


def test_compliant_fence_has_no_rule_conflicts():
    response = client.post("/screen", json={
        "project_type": "Fence", "height_feet": 6,
        "material": "Cedar", "shared_property_line": False,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready_to_package"
    assert data["blockers"] == []
    assert {finding["id"] for finding in data["findings"]} == {"F-12", "F-18", "A-04", "A-09"}


def test_noncompliant_fence_returns_specific_blockers():
    response = client.post("/screen", json={
        "project_type": "Fence", "height_feet": 8,
        "material": "Vinyl", "shared_property_line": True,
    })
    assert response.status_code == 200
    assert response.json()["status"] == "action_needed"
    assert len(response.json()["blockers"]) == 3


def test_invalid_height_is_rejected():
    response = client.post("/screen", json={
        "project_type": "Fence", "height_feet": 0,
        "material": "Cedar", "shared_property_line": False,
    })
    assert response.status_code == 422


def test_fence_requires_material():
    response = client.post("/screen", json={
        "project_type": "Fence", "height_feet": 6,
        "material": "", "shared_property_line": False,
    })
    assert response.status_code == 422


def test_rule_fixture_failure_is_visible(monkeypatch):
    import main
    monkeypatch.setattr(main, "load_rules", lambda: (_ for _ in ()).throw(FileNotFoundError()))
    response = client.post("/screen", json={
        "project_type": "Solar", "height_feet": 4,
        "material": "", "shared_property_line": False,
    })
    assert response.status_code == 503
    assert response.json()["detail"] == "Rule library is unavailable"


def test_domain_operation_directly():
    result = screen_project(Project(project_type="Patio", height_feet=2, material=""), load_rules())
    assert [finding["id"] for finding in result["findings"]] == ["A-04", "A-09", "P-07"]
