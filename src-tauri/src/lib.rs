// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Use the std::fs module for file system operations.
use serde::Serialize;
use std::fs;
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

// The #[tauri::command] macro exposes this function to the frontend.
#[tauri::command]
fn read_file_content(path: String) -> Result<String, String> {
    // The path argument is passed from the frontend.
    match fs::read_to_string(path) {
        // On success, return the file content as a String.
        Ok(content) => {
            print!("{}", content);
            Ok(content)
        }
        // On error (e.g., file not found, permission issue), convert the error to a String.
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}

// #[tauri::command]
// async fn pick_file(app_handle: tauri::AppHandle) -> Option<String> {
//     use tauri_plugin_dialog::DialogExt;
//     app_handle
//         .dialog()
//         .file()
//         .pick_file()
//         .await
//         .map(|path| path.to_string_lossy().to_string())
// }
#[derive(Serialize)]
struct FileReadResult {
    content: String,
    language: String,
}

fn detect_language_from_filename(filename: &str) -> String {
    let ext = filename.split('.').last().unwrap_or("").to_lowercase();
    match ext.as_str() {
        "js" => "javascript",
        "ts" => "typescript",
        "json" => "json",
        "html" => "html",
        "css" => "css",
        "py" => "python",
        "xml" => "xml",
        _ => "plaintext",
    }
    .to_string()
}

#[tauri::command]
async fn choose_and_read_file(app: tauri::AppHandle) -> Result<FileReadResult, String> {
    // let file_path = app.dialog().file().blocking_pick_file().unwrap();
    // let file_path = app.dialog().file().pick_file(|file_path| {
    //     // return a file_path `Option`, or `None` if the user closes the dialog
    //     return file_path;
    // });
    // println!("file_path: {:?}", file_path);
    // let path_buf = file_path.as_path().unwrap().to_path_buf();
    // let data = std::fs::read(path_buf).unwrap();
    let file_path = app.dialog().file().blocking_pick_file();
    println!("file_path: {:?}", file_path);

    match file_path {
        Some(tauri_path_buf) => {
            let std_path_buf: std::path::PathBuf = tauri_path_buf.try_into().unwrap();
            let filename = std_path_buf
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or_default();
            let language = detect_language_from_filename(filename);
            match std::fs::read_to_string(std_path_buf) {
                Ok(data) => Ok(FileReadResult {
                    content: data,
                    language: language,
                }),
                Err(e) => {
                    app.dialog()
                        .message(e.to_string())
                        .kind(MessageDialogKind::Error)
                        .title("Error")
                        .blocking_show();
                    Err(format!("Failed to read file: {}", e))
                }
            }
        }
        None => Err("No file selected".to_string()),
    }
}

#[tauri::command]
fn list_files(path: String) -> Result<Vec<String>, String> {
    use std::fs;
    match fs::read_dir(path) {
        Ok(entries) => Ok(entries
            .filter_map(|e| e.ok().map(|e| e.path().display().to_string()))
            .collect()),
        Err(e) => Err(format!("Failed to list files: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            read_file_content,
            list_files,
            // pick_file,
            choose_and_read_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
