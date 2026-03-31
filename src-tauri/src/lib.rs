use tauri::Manager;
use tauri::webview::PageLoadEvent;
use tauri::{TitleBarStyle, WebviewUrl, WebviewWindowBuilder};

#[cfg(target_os = "macos")]
use cocoa::appkit::{NSView, NSWindow, NSWindowStyleMask};
#[cfg(target_os = "macos")]
use cocoa::base::id;
#[cfg(target_os = "macos")]
use objc::runtime::YES;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      // Create window with overlay titlebar for native traffic lights
      let win = WebviewWindowBuilder::new(app, "main", WebviewUrl::External("https://disciprin.com".parse().unwrap()))
        .title("Disciprin")
        .inner_size(1200.0, 800.0)
        .transparent(true)
        .title_bar_style(TitleBarStyle::Overlay)
        .build()?;

      // Make the window background translucent on macOS
      #[cfg(target_os = "macos")]
      {
        use cocoa::appkit::NSColor;
        use cocoa::foundation::NSString;
        let ns_window = win.ns_window().unwrap() as id;
        unsafe {
          let bg_color = NSColor::colorWithSRGBRed_green_blue_alpha_(cocoa::base::nil, 0.0, 0.0, 0.0, 0.8);
          ns_window.setBackgroundColor_(bg_color);
        }
      }

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
