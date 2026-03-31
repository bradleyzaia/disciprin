#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      // Enable devtools in all builds
      #[cfg(desktop)]
      {
        use tauri::Manager;
        let window = app.get_webview_window("main").unwrap();
        window.open_devtools();
      }

      app.handle().plugin(
        tauri_plugin_log::Builder::default()
          .level(log::LevelFilter::Info)
          .build(),
      )?;
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
