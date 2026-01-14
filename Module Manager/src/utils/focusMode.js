// toggles a class on <html> when user is navigating via keyboard (Tab)
let listening = false;

export function initFocusMode(){
  if (listening) return;
  listening = true;

  function handleFirstTab(e){
    if (e.key === 'Tab'){
      document.documentElement.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
      window.addEventListener('mousedown', handleMouseDownOnce);
    }
  }

  function handleMouseDownOnce(){
    document.documentElement.classList.remove('user-is-tabbing');
    window.removeEventListener('mousedown', handleMouseDownOnce);
    // start listening for Tab again
    window.addEventListener('keydown', handleFirstTab);
  }

  window.addEventListener('keydown', handleFirstTab);
}
