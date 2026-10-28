#!/usr/bin/env bash
# release-note.sh -- post a Release Notes tab entry for stupid_apis (service: stupidapis)
#
# Usage:
#   scripts/release-note.sh <category> <title> <summary> [task_id] [commit_sha ...]
#
#   category   one of: new-mcp | router | bug | other
#   title      what shipped, short
#   summary    one or two plain sentences, the way you'd say it out loud to Bruce
#   task_id    optional; pass "" to skip it while still giving commit SHAs
#   commit_sha any number of git SHAs for the shipped outcome
#
# Full contract: pipeworx repo, docs/release-notes.md. Posts over the shared
# fleet rail from any cwd: ~/.claude/bin/pwcall.sh call fleet_release_note.
set -eo pipefail

SERVICE="stupidapis"
REPO="stupidapis/stupid-apis"

if [ "$#" -lt 3 ]; then
  echo "usage: $0 <category: new-mcp|router|bug|other> <title> <summary> [task_id] [commit_sha ...]" >&2
  exit 1
fi

CATEGORY="$1"
TITLE="$2"
SUMMARY="$3"
TASK_ID="${4:-}"
if [ "$#" -ge 4 ]; then
  shift 4
else
  shift 3
fi
COMMITS=("$@")

case "$CATEGORY" in
  new-mcp|router|bug|other) ;;
  *)
    echo "category must be one of: new-mcp router bug other (got: $CATEGORY)" >&2
    exit 1
    ;;
esac

if [ "${#COMMITS[@]}" -gt 0 ]; then
  REF="${COMMITS[0]}"
elif [ -n "$TASK_ID" ]; then
  REF="task-${TASK_ID}"
else
  REF="$(date -u +%Y%m%dT%H%M%SZ)"
fi
SOURCE_REF="${SERVICE}:${REF}"

PAYLOAD="$(python3 - "$SERVICE" "$CATEGORY" "$TITLE" "$SUMMARY" "$SOURCE_REF" "$REPO" "$TASK_ID" "${COMMITS[@]}" <<'PY'
import json
import sys

service, category, title, summary, source_ref, repo, task_id = sys.argv[1:8]
commits = sys.argv[8:]

payload = {
    "service": service,
    "category": category,
    "title": title,
    "summary": summary,
    "source_ref": source_ref,
    "repo": repo,
}
if commits:
    payload["commits"] = commits
if task_id:
    payload["task_id"] = int(task_id)

print(json.dumps(payload))
PY
)"

exec ~/.claude/bin/pwcall.sh call fleet_release_note "$PAYLOAD"
