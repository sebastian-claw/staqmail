use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;

/// Write an HTML file to the user's documents directory.
#[tauri::command]
pub fn export_html(app: AppHandle, filename: String, content: String) -> Result<String, String> {
    let docs_dir = app
        .path()
        .document_dir()
        .map_err(|e| e.to_string())?;

    let staqmail_dir = docs_dir.join("StaqMail");
    fs::create_dir_all(&staqmail_dir).map_err(|e| e.to_string())?;

    let file_path: PathBuf = staqmail_dir.join(&filename);
    fs::write(&file_path, content).map_err(|e| e.to_string())?;

    Ok(file_path.to_string_lossy().to_string())
}

/// Read a previously saved HTML export.
#[tauri::command]
pub fn read_html(app: AppHandle, filename: String) -> Result<String, String> {
    let docs_dir = app
        .path()
        .document_dir()
        .map_err(|e| e.to_string())?;

    let file_path = docs_dir.join("StaqMail").join(&filename);
    fs::read_to_string(file_path).map_err(|e| e.to_string())
}
