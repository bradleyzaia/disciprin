use tauri::Manager;
use tauri::webview::PageLoadEvent;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      app.handle().plugin(
        tauri_plugin_log::Builder::default()
          .level(log::LevelFilter::Info)
          .build(),
      )?;
      Ok(())
    })
    .on_page_load(|webview, payload| {
      if payload.event() == PageLoadEvent::Finished {
        let _ = webview.eval(
          "document.documentElement.classList.add('tauri');
           document.documentElement.style.background = 'transparent';
           document.body.style.background = 'transparent';"
        );
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
