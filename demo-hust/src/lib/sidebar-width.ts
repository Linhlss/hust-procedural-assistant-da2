export const SIDEBAR_WIDTH_KEY='hust-sidebar-width';
export const SIDEBAR_DEFAULT=232;
export const SIDEBAR_MIN=200;
export const SIDEBAR_MAX=360;

export function sidebarMaximum(viewport:number){return Math.max(SIDEBAR_MIN,Math.min(SIDEBAR_MAX,Math.floor(viewport*.35)));}
export function sidebarWidth(value:number,viewport:number){return Math.round(Math.max(SIDEBAR_MIN,Math.min(sidebarMaximum(viewport),value)));}
export function preferredSidebarWidth(value:string|null){const parsed=value===null||value.trim()===''?NaN:Number(value);return Number.isFinite(parsed)?Math.round(Math.max(SIDEBAR_MIN,Math.min(SIDEBAR_MAX,parsed))):SIDEBAR_DEFAULT;}
// Match the client bounds before paint, without depending on history or theme storage.
export const sidebarWidthBootstrap=`try{const saved=localStorage.getItem('${SIDEBAR_WIDTH_KEY}');const parsed=saved===null||saved.trim()===''?NaN:Number(saved);const preferred=Number.isFinite(parsed)?Math.max(${SIDEBAR_MIN},Math.min(${SIDEBAR_MAX},parsed)):${SIDEBAR_DEFAULT};const maximum=Math.max(${SIDEBAR_MIN},Math.min(${SIDEBAR_MAX},Math.floor(innerWidth*.35)));document.documentElement.style.setProperty('--sidebar-width',Math.round(Math.max(${SIDEBAR_MIN},Math.min(maximum,preferred)))+'px')}catch(e){}`;
