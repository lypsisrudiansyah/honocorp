#!/usr/bin/env bash

# ==========================================
# Configuration Variables
# ==========================================
TARGET_DIR="docs/tasks"
FILE_PREFIX="task"
FILE_EXT=".txt"

mkdir -p "$TARGET_DIR"

create_single_task() {
    local num="$1"
    local target_file="${TARGET_DIR}/${FILE_PREFIX}${num}${FILE_EXT}"
    if [ -f "$target_file" ]; then
        echo "[!] Warning: File '$target_file' already exists."
    else
        touch "$target_file"
        echo "[+] Fresh file created: $target_file"
    fi
}

PARAM1="$1"
PARAM2="$2"

if [ -n "$PARAM1" ]; then
    # Support range like 3,15 or 3-15 or two arguments "3 15" or single number "3"
    if [[ "$PARAM1" =~ ^[0-9]+[,|-][0-9]+$ ]]; then
        START_NUM=$(echo "$PARAM1" | sed -E 's/([0-9]+)[,|-]([0-9]+)/\1/')
        END_NUM=$(echo "$PARAM1" | sed -E 's/([0-9]+)[,|-]([0-9]+)/\2/')
    elif [[ "$PARAM1" =~ ^[0-9]+$ ]] && [[ "$PARAM2" =~ ^[0-9]+$ ]]; then
        START_NUM="$PARAM1"
        END_NUM="$PARAM2"
    elif [[ "$PARAM1" =~ ^[0-9]+$ ]]; then
        START_NUM="$PARAM1"
        END_NUM="$PARAM1"
    else
        echo "Invalid format. Examples: 'createTask 3', 'createTask 3,15', 'createTask 3-15', or 'createTask 3 15'"
        exit 1
    fi
else
    # Auto-detect next number if no parameter passed
    MAX_NUM=0
    for f in "$TARGET_DIR"/${FILE_PREFIX}*${FILE_EXT}; do
        if [ -f "$f" ]; then
            filename=$(basename "$f")
            num=$(echo "$filename" | sed -E "s/^${FILE_PREFIX}([0-9]+)${FILE_EXT}$/\1/")
            if [[ "$num" =~ ^[0-9]+$ ]] && [ "$num" -gt "$MAX_NUM" ]; then
                MAX_NUM=$num
            fi
        fi
    done
    START_NUM=$((MAX_NUM + 1))
    END_NUM=$START_NUM
fi

for (( i=START_NUM; i<=END_NUM; i++ )); do
    create_single_task "$i"
done
