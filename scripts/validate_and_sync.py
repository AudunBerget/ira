"""
Fetches the most recently uploaded/modified file from a specific Google Drive
folder, validates its size, and writes it to the repo path if it passes.
Designed to be run inside the GitHub Action, but works fine locally too if
you set the same env vars.

Exits with a non-zero code (and a clear message) on any validation failure,
so the workflow step fails loudly instead of silently committing bad data.
"""

import hashlib
import io
import os
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

# ---- Configuration -----------------------------------------------------

FOLDER_ID = os.environ["GDRIVE_FOLDER_ID"]
TARGET_PATH = os.environ.get("TARGET_PATH", "public/IRAComplete.xls")
SA_KEY_PATH = "sa_key.json"

MIN_SIZE_BYTES = 5_000        # reject if suspiciously small (near-empty file)
MAX_SIZE_BYTES = 20_000_000   # reject if suspiciously large (20MB)

# --------------------------------------------------------------------------


def fail(message):
    print(f"VALIDATION FAILED: {message}", file=sys.stderr)
    sys.exit(1)


def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        SA_KEY_PATH, scopes=["https://www.googleapis.com/auth/drive.readonly"]
    )
    return build("drive", "v3", credentials=creds)


def find_newest_file(service):
    """Look at every non-trashed file directly in the target folder and
    return whichever one was modified most recently — regardless of name.
    This means as long as the trusted user drops or updates a file in this
    folder, it'll be picked up, even if the filename varies month to month."""
    query = f"'{FOLDER_ID}' in parents and trashed = false"
    results = service.files().list(
        q=query,
        fields="files(id, name, modifiedTime, size, owners)",
        orderBy="modifiedTime desc",
    ).execute()

    files = results.get("files", [])
    if not files:
        fail(f"No files found in folder {FOLDER_ID}.")

    latest = files[0]
    print(f"Found newest file: {latest['name']} (id={latest['id']}, "
          f"modified={latest['modifiedTime']}, "
          f"owner={latest.get('owners', [{}])[0].get('emailAddress', 'unknown')})")
    return latest


def download_file(service, file_id):
    request = service.files().get_media(fileId=file_id)
    buffer = io.BytesIO()
    downloader = MediaIoBaseDownload(buffer, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    buffer.seek(0)
    return buffer.read()


def validate(content):
    """Only checks file size falls within an expected range — catches
    near-empty files (upload failed / wrong file) and suspiciously huge
    ones (wrong file entirely), without inspecting the file's contents."""
    size = len(content)
    if size < MIN_SIZE_BYTES:
        fail(f"File is only {size} bytes — looks empty or truncated "
             f"(minimum expected: {MIN_SIZE_BYTES} bytes).")
    if size > MAX_SIZE_BYTES:
        fail(f"File is {size} bytes — larger than expected "
             f"(maximum allowed: {MAX_SIZE_BYTES} bytes).")

    print(f"Validation passed: file size is {size} bytes "
          f"(expected range: {MIN_SIZE_BYTES}-{MAX_SIZE_BYTES}).")


def file_hash(path_or_bytes):
    if isinstance(path_or_bytes, bytes):
        data = path_or_bytes
    else:
        if not os.path.exists(path_or_bytes):
            return None
        with open(path_or_bytes, "rb") as f:
            data = f.read()
    return hashlib.sha256(data).hexdigest()


def main():
    service = get_drive_service()
    latest = find_newest_file(service)
    content = download_file(service, latest["id"])

    validate(content)

    new_hash = file_hash(content)
    old_hash = file_hash(TARGET_PATH)
    changed = new_hash != old_hash

    if changed:
        os.makedirs(os.path.dirname(TARGET_PATH), exist_ok=True)
        with open(TARGET_PATH, "wb") as f:
            f.write(content)
        print(f"File written to {TARGET_PATH} (content changed).")
    else:
        print("Downloaded file is identical to what's already in the repo. Nothing to commit.")

    # Communicate back to the workflow step
    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a") as f:
            f.write(f"changed={'true' if changed else 'false'}\n")


if __name__ == "__main__":
    main()
