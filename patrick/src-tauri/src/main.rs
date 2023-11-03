use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};
use std::thread;
use std::io::{BufRead, BufReader};
use lazy_static::lazy_static;

#[tauri::command]
fn celestia_version() -> String {
  let output = Command::new("./celestia")
    .arg("version")
    .output()
    .expect("failed to execute process");

  String::from_utf8_lossy(&output.stdout).to_string()
}

#[tauri::command]
fn celestia_init() -> Result<String, tauri::InvokeError> {
  let output = Command::new("./celestia")
    .arg("light")
    .arg("init")
    .output()
    .map_err(|e| tauri::InvokeError::from(e.to_string()))?;

  Ok(String::from_utf8_lossy(&output.stderr).to_string())
}

lazy_static! {
  static ref OUTPUT: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));
}

#[tauri::command]
fn celestia_start() -> Result<String, tauri::InvokeError> {
  let mut child = Command::new("./celestia")
    .arg("light")
    .arg("start")
    .stdout(Stdio::piped())
    .spawn()
    .map_err(|e| tauri::InvokeError::from(e.to_string()))?;

  let reader = BufReader::new(child.stdout.take().unwrap());

  let output_arc = Arc::clone(&OUTPUT);
  thread::spawn(move || {
    for line in reader.lines() {
      let mut output = output_arc.lock().unwrap();
      output.push(line.unwrap());
    }
  });

  Ok("Process started".to_string())
}

#[tauri::command]
fn get_output() -> Result<Vec<String>, tauri::InvokeError> {
  let output = OUTPUT.lock().unwrap().clone();
  Ok(output)
}

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![celestia_version, celestia_init, celestia_start, get_output])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}