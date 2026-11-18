#!/usr/bin/env bash
# Delegate a bulk task (research, source collection, image search, CI babysitting) to a GPT model via OpenCode.
# Usage: tools/gpt.sh <heavy|mid|free> <output-file inside the repo> "task text"  (OpenCode refuses paths outside D:studio)
# The model must WRITE its result to <output-file>; only a short status line is printed, so the calling
# Claude chat reads a small file instead of long tool output. Falls back down the chain if a model fails.
set -u
tier="${1:?tier: heavy|mid|free}"; out="${2:?output file}"; task="${3:?task}"
case "$tier" in
  heavy) chain="agentrouter-responses/gpt-6.1-sol agentrouter/gpt-5.6-sol opencode/big-pickle" ;;
  mid)   chain="agentrouter/gpt-5.6-sol opencode/big-pickle agentrouter-responses/gpt-6.1-sol" ;;
  free)  chain="opencode/big-pickle agentrouter/gpt-5.6-sol" ;;
  *) echo "unknown tier $tier"; exit 2 ;;
esac
cd "$(dirname "$0")/.."
mkdir -p "$(dirname "$out")"
log="$(mktemp)"
prompt="$task

Rules: follow AGENTS.md. Read only the files you need (sections, not whole files). Do not render video locally.
Write your complete result as Markdown to: $out (create or overwrite it). Cite every fact with URL + date.
Finish by replying with ONE line: DONE <short summary>."
for m in $chain; do
  if timeout 3600 opencode run -m "$m" "$prompt" >"$log" 2>&1 && [ -s "$out" ]; then
    echo "OK $m -> $out ($(wc -c <"$out") bytes): $(grep -E '^DONE' "$log" | tail -1 | cut -c1-200)"
    rm -f "$log"; exit 0
  fi
  echo "FAIL $m: $(grep -iE 'error' "$log" | tail -1 | cut -c1-160)"
done
rm -f "$log"; exit 1
