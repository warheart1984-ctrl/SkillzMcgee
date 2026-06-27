# COMMUNICATION CANON (COMM-CANON)
Version: 1.0.0
Generated: 2026-06-27T05:12:29.098Z
Status: SEALED

---

## §1 — ACTIVE LANES
```json
{
  "lanes": [
    {
      "lane_id": "jon-darz-architecture",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "normative",
        "architectural",
        "methodological"
      ],
      "allowed_altitudes": [
        "constitutional",
        "architectural",
        "engineering"
      ],
      "max_impact": "spec",
      "human_bandwidth": "low",
      "reroute_to": "jon-darz-human",
      "continuity_budget": {
        "max_composite": 0.3,
        "session_budget": 0.5,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T00:53:56.876Z",
      "updated_at": "2026-06-27T00:53:56.876Z"
    },
    {
      "lane_id": "jon-darz-spec",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "normative",
        "architectural",
        "methodological"
      ],
      "allowed_altitudes": [
        "constitutional",
        "architectural"
      ],
      "max_impact": "spec",
      "human_bandwidth": "none",
      "reroute_to": "jon-darz-human",
      "continuity_budget": {
        "max_composite": 0.3,
        "session_budget": 0.5,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T00:53:56.876Z",
      "updated_at": "2026-06-27T00:53:56.876Z"
    },
    {
      "lane_id": "jon-darz-human",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human",
        "implementation"
      ],
      "allowed_altitudes": [
        "human",
        "engineering"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "daily"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T00:53:56.876Z",
      "updated_at": "2026-06-27T00:53:56.876Z"
    },
    {
      "lane_id": "test-comm-1782521636886",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T00:53:56.886Z",
      "updated_at": "2026-06-27T00:53:56.920Z"
    },
    {
      "lane_id": "test-comm-1782522140773",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T01:02:20.773Z",
      "updated_at": "2026-06-27T01:02:20.792Z"
    },
    {
      "lane_id": "test-comm-1782522185098",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T01:03:05.098Z",
      "updated_at": "2026-06-27T01:03:05.099Z"
    },
    {
      "lane_id": "test-comm-1782522428938",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T01:07:08.939Z",
      "updated_at": "2026-06-27T01:07:08.939Z"
    },
    {
      "lane_id": "test-comm-1782522478418",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T01:07:58.418Z",
      "updated_at": "2026-06-27T01:07:58.419Z"
    },
    {
      "lane_id": "test-comm-1782523151930",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T01:19:11.930Z",
      "updated_at": "2026-06-27T01:19:11.931Z"
    },
    {
      "lane_id": "test-comm-1782534475671",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T04:27:55.671Z",
      "updated_at": "2026-06-27T04:27:55.672Z"
    },
    {
      "lane_id": "test-comm-1782534524500",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T04:28:44.500Z",
      "updated_at": "2026-06-27T04:28:44.501Z"
    },
    {
      "lane_id": "test-comm-1782534824738",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T04:33:44.738Z",
      "updated_at": "2026-06-27T04:33:44.739Z"
    },
    {
      "lane_id": "test-comm-1782534882570",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T04:34:42.570Z",
      "updated_at": "2026-06-27T04:34:42.571Z"
    },
    {
      "lane_id": "test-comm-1782537148490",
      "participants": [
        "jon",
        "darz"
      ],
      "allowed_categories": [
        "human"
      ],
      "allowed_altitudes": [
        "human"
      ],
      "max_impact": "none",
      "human_bandwidth": "high",
      "continuity_budget": {
        "max_composite": 0.5,
        "session_budget": 1,
        "session_spent": 0,
        "reset_policy": "per-epoch"
      },
      "drift_thresholds": {
        "warn": 0.05,
        "notify": 0.15,
        "contain": 0.3,
        "fail_closed": 0.5
      },
      "comm_constitution_version": "1.0.0",
      "status": "ACTIVE",
      "created_at": "2026-06-27T05:12:28.490Z",
      "updated_at": "2026-06-27T05:12:28.492Z"
    }
  ]
}
```

## §2 — EPOCHS
```json
{
  "epochs": [
    {
      "epoch_id": "EPOCH-test-comm-1782521636886-1782521637207",
      "lane_id": "test-comm-1782521636886",
      "started_at": "2026-06-27T00:53:57.207Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782522140773-1782522140806",
      "lane_id": "test-comm-1782522140773",
      "started_at": "2026-06-27T01:02:20.806Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782522185098-1782522185117",
      "lane_id": "test-comm-1782522185098",
      "started_at": "2026-06-27T01:03:05.117Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782522428938-1782522428958",
      "lane_id": "test-comm-1782522428938",
      "started_at": "2026-06-27T01:07:08.958Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782522478418-1782522478433",
      "lane_id": "test-comm-1782522478418",
      "started_at": "2026-06-27T01:07:58.433Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782523151930-1782523151945",
      "lane_id": "test-comm-1782523151930",
      "started_at": "2026-06-27T01:19:11.945Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782534475671-1782534475685",
      "lane_id": "test-comm-1782534475671",
      "started_at": "2026-06-27T04:27:55.685Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782534524500-1782534524516",
      "lane_id": "test-comm-1782534524500",
      "started_at": "2026-06-27T04:28:44.516Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782534824738-1782534824751",
      "lane_id": "test-comm-1782534824738",
      "started_at": "2026-06-27T04:33:44.751Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782534882570-1782534882586",
      "lane_id": "test-comm-1782534882570",
      "started_at": "2026-06-27T04:34:42.586Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    },
    {
      "epoch_id": "EPOCH-test-comm-1782537148490-1782537148509",
      "lane_id": "test-comm-1782537148490",
      "started_at": "2026-06-27T05:12:28.509Z",
      "session_budget": 1,
      "session_spent": 0.02,
      "drift_max": 0.02,
      "ticks_count": 1,
      "status": "ACTIVE"
    }
  ]
}
```

## §3 — CONTINUITY BUDGETS
```json
{
  "budgets": {
    "jon-darz-architecture": {
      "max_composite": 0.3,
      "session_budget": 0.5,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "jon-darz-spec": {
      "max_composite": 0.3,
      "session_budget": 0.5,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "jon-darz-human": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "daily"
    },
    "test-comm-1782521636886": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782522140773": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782522185098": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782522428938": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782522478418": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782523151930": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782534475671": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782534524500": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782534824738": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782534882570": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    },
    "test-comm-1782537148490": {
      "max_composite": 0.5,
      "session_budget": 1,
      "session_spent": 0,
      "reset_policy": "per-epoch"
    }
  }
}
```

## §4 — DRIFT THRESHOLDS
```json
{
  "drift_thresholds": {
    "warn": 0.05,
    "notify": 0.15,
    "contain": 0.3,
    "fail_closed": 0.5
  }
}
```

## §5 — CROSS-LANE INVARIANTS
```json
{
  "cross_lane_invariants": [
    {
      "invariant_id": "X-1",
      "description": "Spec changes must originate from normative/architectural lanes.",
      "status": "ENFORCED"
    },
    {
      "invariant_id": "X-2",
      "description": "Human-category messages must not enter spec lanes.",
      "status": "ENFORCED"
    },
    {
      "invariant_id": "X-3",
      "description": "Global communication drift must remain below 0.70.",
      "status": "ENFORCED"
    }
  ]
}
```

## §6 — ROUTING RULES
```json
{
  "routing_rules": [
    {
      "from_lane": "jon-darz-spec",
      "to_lane": "jon-darz-human",
      "reason": "category_out_of_corridor"
    },
    {
      "source_lane": "jon-darz-human",
      "target_lane": "jon-darz-architecture",
      "threshold": 0.25,
      "effect": "warn"
    }
  ]
}
```

## §7 — CONSTITUTION VERSIONS
```json
{
  "constitution_versions": {
    "AAIS-COMM-Λ-001": "1.0.0",
    "AAIS-COMM-Λ-002": "1.0.0",
    "COMM-CANON": "1.0.0",
    "canon_state": "FROZEN"
  }
}
```

## §8 — LANE TOPOLOGY
```json
{
  "lane_topology": {
    "splits": [],
    "merges": [],
    "retired_lanes": []
  }
}
```
