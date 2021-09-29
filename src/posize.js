import { html, LitElement } from 'lit-element';
import styleToCss from './style-object-to-css-string';

// posize version v1.00.2

const config = { debug: false };
const rep = /\s*,\s*/g
const split = /\s+/

const styles = {
  absTrack: {
    pointerEvents: 'none',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },

  relTrack: {
    pointerEvents: 'none',
    position: 'relative',
    // height: '100%', no need set height
    width: '100%',
  },

  area: {
    pointerEvents: 'auto',
    position: 'relative',
    width: '100%', // fit box, it is necessary because child need refer parent size
    height: '100%' // fit box, it is necessary because child need refer parent size
  },

  debugTrack: {
    outlineWidth: '1px',
    outlineColor: '#106709',
    outlineStyle: 'solid',
    outlineOffset: '-1px'
  },

  debugArea: {
    outlineWidth: '3px',
    outlineColor: '#106709',
    outlineStyle: 'solid',
    outlineOffset: '-3px'
  }
};

export class Posize extends LitElement {
  constructor() {
    super();
  }

  static get properties() {
    return {
      x: { type: String, reflect: true },
      y: { type: String, reflect: true },
      'z-index': { type: Number, reflect: true },
      'max-x': { type: String, reflect: true },
      'max-y': { type: String, reflect: true },
      'xxxl-x': { type: String, reflect: true },
      'xxxl-y': { type: String, reflect: true },
      'xxl-x': { type: String, reflect: true },
      'xxl-y': { type: String, reflect: true },
      'xl-x': { type: String, reflect: true },
      'xl-y': { type: String, reflect: true },
      'lg-x': { type: String, reflect: true },
      'lg-y': { type: String, reflect: true },
      'md-x': { type: String, reflect: true },
      'md-y': { type: String, reflect: true },
      'sm-x': { type: String, reflect: true },
      'sm-y': { type: String, reflect: true },
      'xs-x': { type: String, reflect: true },
      'xs-y': { type: String, reflect: true },
      'max-z-index': { type: Number, reflect: true },
      'xxxl-z-index': { type: Number, reflect: true },
      'xxl-z-index': { type: Number, reflect: true },
      'xl-z-index': { type: Number, reflect: true },
      'lg-z-index': { type: Number, reflect: true },
      'md-z-index': { type: Number, reflect: true },
      'sm-z-index': { type: Number, reflect: true },
      'xs-z-index': { type: Number, reflect: true },
      'max-display': { type: String, reflect: true },
      'xxxl-display': { type: String, reflect: true },
      'xxl-display': { type: String, reflect: true },
      'xl-display': { type: String, reflect: true },
      'lg-display': { type: String, reflect: true },
      'md-display': { type: String, reflect: true },
      'sm-display': { type: String, reflect: true },
      'xs-display': { type: String, reflect: true },
      name: { type: String, reflect: true },
      absolute: { type: Boolean, reflect: true },
      'alt-class': { type: String, reflect: true },
      'track-style': { type: String, reflect: true },
      'area-style': { type: String, reflect: true }
    };
  }

  genCssStyle(baseClass, cssObject) {
    const oneLevelCssObject = {}

    let css = '';
    for (const [key, value] of Object.entries(cssObject)) {
      if(typeof value === "object") {
        css = `${css}\n ${this.genCssStyle(`${baseClass} ${key}`, value)}`;
      } else {
        oneLevelCssObject[key] = value;
      }
    }

    css = `${baseClass} {${styleToCss(oneLevelCssObject)}}\n ${css}`;
    return css;
  }

  genTrackStyles(x, y, zIndex, display) {
    let result = {};
    if(x && y) {
      result = {
        grid: `${y} / ${x}`,
      };
    }

    if(zIndex) {
      result.zIndex = zIndex;
    }
    if(display === 'show') {
      result.display = 'grid';
    } else if(display === 'none') {
      result.display = 'none';
    }

    return result;
  }

  genAreaStyles(x, y) {
    if(!x || !y) return {};

    const v = Math.round(y.replace(rep, ',').split(split).length / 2);
    const h = Math.round(x.replace(rep, ',').split(split).length / 2);

    return {
      gridArea: `${v} / ${h} / ${v} / ${h}`
    }
  }

  genGridStyles(x, y, zIndex,
                maxx, maxy, xxxlx, xxxly, xxlx, xxly, xlx, xly, lgx, lgy, mdx, mdy, smx, smy, xsx, xsy,
                maxZIndex, xxxlZIndex, xxlZIndex, xlZIndex, lgZIndex, mdZIndex, smZIndex, xsZIndex,
                maxDisplay, xxxlDisplay, xxlDisplay, xlDisplay, lgDisplay, mdDisplay, smDisplay, xsDisplay) {
    return {
      track: this.genTrackStyles(x, y, zIndex),
      maxTrack: this.genTrackStyles(maxx, maxy, maxZIndex, maxDisplay),
      xxxlTrack: this.genTrackStyles(xxxlx, xxxly, xxxlZIndex, xxxlDisplay),
      xxlTrack: this.genTrackStyles(xxlx, xxly, xxlZIndex, xxlDisplay),
      xlTrack: this.genTrackStyles(xlx, xly, xlZIndex, xlDisplay),
      lgTrack: this.genTrackStyles(lgx, lgy, lgZIndex, lgDisplay),
      mdTrack: this.genTrackStyles(mdx, mdy, mdZIndex, mdDisplay),
      smTrack: this.genTrackStyles(smx, smy, smZIndex, smDisplay),
      xsTrack: this.genTrackStyles(xsx, xsy, xsZIndex, xsDisplay),

      area: this.genAreaStyles(x, y),
      maxArea: this.genAreaStyles(maxx, maxy),
      xxxlArea: this.genAreaStyles(xxxlx, xxxly),
      xxlArea: this.genAreaStyles(xxlx, xxly),
      xlArea: this.genAreaStyles(xlx, xly),
      lgArea: this.genAreaStyles(lgx, lgy),
      mdArea: this.genAreaStyles(mdx, mdy),
      smArea: this.genAreaStyles(smx, smy),
      xsArea: this.genAreaStyles(xsx, xsy),
    };
  }

  render() {
    const {
      x = '1fr 1fr 1fr',
      y = '1fr 1fr 1fr',
      absolute,
      debug
    } = this;

    const gridStyles = this.genGridStyles(x, y, this['z-index'],
      this['max-x'], this['max-y'], this['xxxl-x'], this['xxxl-y'], this['xxl-x'], this['xxl-y'], this['xl-x'], this['xl-y'], this['lg-x'], this['lg-y'], this['md-x'], this['md-y'], this['sm-x'], this['sm-y'], this['xs-x'], this['xs-y'],
      this['max-z-index'], this['xxxl-z-index'], this['xxl-z-index'], this['xl-z-index'], this['lg-z-index'], this['md-z-index'], this['sm-z-index'], this['xs-z-index'],
      this['max-display'], this['xxxl-display'], this['xxl-display'], this['xl-display'], this['lg-display'], this['md-display'], this['sm-display'], this['xs-display'],
    );
    const track = styleToCss(absolute ? styles.absTrack : styles.relTrack);
    const area = styleToCss(styles.area);
    const debugTrack = (config.debug || debug)? styleToCss(styles.debugTrack) : '';
    const debugArea = (config.debug || debug)? styleToCss(styles.debugArea) : '';

    return html`
      <style>
      :host {
          display: grid;
          ${track}
          ${debugTrack}
          ${styleToCss(gridStyles.track)}
      }
      
      .area {
          ${area}
          ${debugArea}
          ${styleToCss(gridStyles.area)}
      }
      
      @media (max-width: 99999px) {
         :host {
            ${styleToCss(gridStyles.maxTrack)}
         }
         .area {
            ${styleToCss(gridStyles.maxArea)}
         }          
      }
      
      @media (max-width: 2999.98px) {
         :host {
            ${styleToCss(gridStyles.xxxlTrack)}
         }
         .area {
            ${styleToCss(gridStyles.xxxlArea)}
         }          
      }

      @media (max-width: 1919.98px) {
         :host {
            ${styleToCss(gridStyles.xxlTrack)}
         }
         .area {
            ${styleToCss(gridStyles.xxlArea)}
         }          
      }
                  
      @media (max-width: 1399.98px) {
         :host {
            ${styleToCss(gridStyles.xlTrack)}
         }
         .area {
            ${styleToCss(gridStyles.xlArea)}
         }          
      }
                  
      @media (max-width: 1199.98px) {
         :host {
            ${styleToCss(gridStyles.lgTrack)}
         }
         .area {
            ${styleToCss(gridStyles.lgArea)}
         }
      }
            
      @media (max-width: 991.98px) {
         :host {
            ${styleToCss(gridStyles.mdTrack)}
         }
         .area {
            ${styleToCss(gridStyles.mdArea)}
         } 
      }
      
      @media (max-width: 767.98px) {
         :host {
            ${styleToCss(gridStyles.smTrack)}
          }
         .area {
            ${styleToCss(gridStyles.smArea)}
         } 
      }

      @media (max-width: 575.98px) {
         :host {
            ${styleToCss(gridStyles.xsTrack)}
          }
         .area {
            ${styleToCss(gridStyles.xsArea)}
         } 
      }
      
      ${this['track-style']? this.genCssStyle(':host', JSON.parse(this['track-style'])) : ''}
      ${this['area-style']? this.genCssStyle('.area', JSON.parse(this['area-style'])) : ''}
      </style>
      
      <div class="area">
         <slot></slot>
    </div>`;
  }
}

window.customElements.define('px-posize', Posize);
