from pathlib import Path
from typing import Literal
import json

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator

FIXTURE_PATH = Path(__file__).resolve().parents[1] / "data" / "demo_rules.json"


class Project(BaseModel):
    project_type: Literal["Fence", "Patio", "Solar"]
    height_feet: float = Field(ge=1, le=12)
    material: str = Field(default="", max_length=80)
    shared_property_line: bool = False

    @field_validator("material")
    @classmethod
    def material_required_for_fence(cls, value: str, info):
        if info.data.get("project_type") == "Fence" and not value.strip():
            raise ValueError("material is required for Fence projects")
        return value.strip()


def load_rules() -> dict:
    if not FIXTURE_PATH.exists():
        raise FileNotFoundError("demo rule fixture is missing")
    return json.loads(FIXTURE_PATH.read_text())


def screen_project(project: Project, fixture: dict) -> dict:
    findings = [
        rule for rule in fixture["rules"]
        if rule["category"] in ("All", project.project_type)
    ]
    blockers: list[str] = []
    if project.project_type == "Fence":
        if project.height_feet > 6:
            blockers.append("Reduce fence height to 6 ft or request a variance.")
        if project.material.lower() not in {"cedar", "composite", "wrought iron"}:
            blockers.append("Choose an approved fence material.")
        if project.shared_property_line:
            blockers.append("Collect neighbor acknowledgment before submission.")

    required = [
        "Labeled site plan with dimensions",
        "Color photo of project area",
        "Owner signature",
    ]
    if project.project_type == "Fence":
        required.append("Fence elevation and material sample")
    if project.shared_property_line:
        required.append("Adjacent owner acknowledgment")

    return {
        "community": fixture["community"],
        "fictional": fixture["fictional"],
        "status": "action_needed" if blockers else "ready_to_package",
        "findings": findings,
        "blockers": blockers,
        "required_documents": required,
    }


app = FastAPI(title="ArcReady API", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok", "fixture": "fictional"}


@app.post("/screen")
def screen(project: Project):
    try:
        return screen_project(project, load_rules())
    except (FileNotFoundError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=503, detail="Rule library is unavailable") from exc
