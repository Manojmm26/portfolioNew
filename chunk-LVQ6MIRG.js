import{$ as i,l as m}from"./chunk-FJLZPIOP.js";var h=class t{_theme=new m("light-theme");theme$=this._theme.asObservable();THEME_KEY="app-theme";constructor(){this.initializeTheme()}initializeTheme(){let e=localStorage.getItem(this.THEME_KEY);if(e&&this.isValidTheme(e))this.setTheme(e);else{let a=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;this.setTheme(a?"dark-theme":"light-theme")}}setTheme(e){this.isValidTheme(e)&&(document.body.className=e,localStorage.setItem(this.THEME_KEY,e),this._theme.next(e))}getTheme(){return this._theme.value}getAvailableThemes(){return[{name:"light-theme",displayName:"Light"},{name:"dark-theme",displayName:"Dark"},{name:"nature-theme",displayName:"Nature"},{name:"ocean-theme",displayName:"Ocean"}]}isValidTheme(e){return["light-theme","dark-theme","nature-theme","ocean-theme"].includes(e)}static \u0275fac=function(a){return new(a||t)};static \u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"})};export{h as a};
