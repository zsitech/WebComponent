// 这里必须命名为template, 否则会报错：Uncaught TypeError: Cannot read property 'cloneNode' of undefined
const template = document.createElement('template');

template.innerHTML = `
    <style type="text/css">
        :host {
            display: inline;
        }

        .x-button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            color: white;
            height: 30px;            
            min-width: 80px;
            max-width: 200px;
            background-color: #184C85;
            border-radius: 5px;
            outline: none;
            font: 16px "Microsoft YaHei";
            border: none;
            cursor:pointer; 
        }

        .x-span {
            position: relative;
            display: inline-flex;
            justify-content: center;
            align-items: center;      
            min-width: 80px;
            max-width: 200px;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            -webkit-user-select: none;
            user-select: none;
        }

        .x-span:before{
          position: absolute;
          display: block;
          top: 0; right: 0; bottom: 0; left: 0;
          z-index:1;
          border-radius: 5px;
          background: rgba(0,0,0,.1);
        }
        
        .x-span:hover:before{
          content: '';
        }
      
        .x-span:after{
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          z-index: 1;
          border-radius: 5px;
          background: rgba(255,255,255,.2);
        }
        
        .x-span:active:after{
          content: '';
        }

        .x-slot {
            padding: 5px;
        }
        .x-shadow {
            box-shadow: 3px 3px 3px gray;
        }
    </style>

    <div class="x-button">
        <span class="x-span"><slot class="x-slot"></slot></span>        
    </div>
    `;
// <button class="x-button" type="button"><slot></slot></button>   
class XButton extends HTMLElement {
    // 自定义组件的属性
    static get observedAttributes() {
        return ["data-effect-type", 'data-background-color', 'data-color', 'data-elevation'];
    }

    constructor() {
        super();
        // 创建 shadow root
        let shadow = this.attachShadow({
            mode: 'open'
        });

        // 将 Shadow DOM 添加到 Shadow root 上
        shadow.appendChild(template.content.cloneNode(true)); // let content = template.content.cloneNode(true);

        // 这个写法和下面的效果一样
        // this.onclick = () =>{
        //     console.log('click me.');
        // };
        // 为组件添加事件             
        // this.addEventListener('click', () => {
        //     console.log('click me.');
        // });

    }

    connectedCallback() {
        console.log("Web Component insert.");
    }

    disconnectedCallback() {
        console.log("Web Component remove.");
    }

    adoptedCallback() {
        console.log("Web Component remove to new DOM.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Web Component Attribute: ' + name + ': ' + oldValue + ', ' + newValue);

        let htmlElement = this.shadowRoot;

        // 把传进来的属性应用到元素上面去 
        this.applicationCSSStyle(htmlElement, name, newValue);      

        // 根据属性改变确定要绑定的事件        
        let condition = parseInt(this.getAttribute('data-effect-type'));
        this.visualEffect(htmlElement, condition);
         
    }

    // 实现一些视觉效果
    visualEffect(shadowRoot, effectType) {
        let element = shadowRoot.querySelector('.x-button');
        switch (effectType) {
            case 0:
                break;
            case 1:
                this.addEventListener('mouseover', (event) => {
                    element.classList.add('shadow');
                });
                this.addEventListener('mouseout', (event) => {
                    element.classList.remove('shadow');
                });
                this.addEventListener('mousedown', (event) => {
                    element.classList.remove('shadow');
                });
                this.addEventListener('mouseup', (event) => {
                    element.classList.add('shadow');
                });
                break;
            case 2:                
                this.addEventListener('mousedown', (event) => {
                    element.classList.remove('shadow');
                });
                this.addEventListener('mouseup', (event) => {
                    element.classList.add('shadow');
                });
                break;
            default:
                break;
        }

    }

    // 把传进来的属性应用到元素上面去
    applicationCSSStyle(shadowRoot, attr, value) {    
        let element = shadowRoot.querySelector('.x-button');  
        // 更改CSS样式  
        switch (attr) {
            case 'data-color':         
            element.style.setProperty(attr.substring(attr.indexOf('-') + 1), value);  
                // element.style.color = value; // 这样也是可以设置的                 
                break;
            case 'data-background-color':
                element.style.setProperty(attr.substring(attr.indexOf('-') + 1), value);
                break;
            case 'data-elevation':
                value == '1' ? element.classList.add('shadow') : element.classList.remove('shadow');
                break;
            case 'data-effect-type':
                break;
            default:
                break;
        }

        
    }
}

window.customElements.define('x-button', XButton);




// function test(el) {
//     let shadow2 = el.shadowRoot;
//     Array.from(shadow2.childNodes).forEach(child => {
//         console.log(child.nodeName)
//     });   
// }

// attrs.forEach((attr) => {
//     console.log(attr + ": " + htmlElement.getAttribute(attr));
// });


// element.style.backgroundColor = value;
// element.style.cssText += attr.substring(attr.indexOf('-') + 1) + ': ' + value + ';';  // 这样也是可以设置的 
// element.setAttribute(attr.substring(attr.indexOf('-') + 1),  value); // 这样设置不可以, setAttribute第一次用的时候可以，第二次就不行了