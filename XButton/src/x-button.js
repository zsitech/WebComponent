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
            width: 108px;
            height: 30px;
            background-color: #184C85;
            border-radius: 5px;
            outline: none;
            font: 16px "Microsoft YaHei";
            border: none;
            padding: 0px;            
        }

        .x-button:hover {
            background-color: #336CAB;
        }

        .x-span {
            -webkit-user-select: none;
            user-select: none;
        }

        .shadow {
            box-shadow: 3px 3px 3px gray;
        }
    </style>
    <div class="x-button">
        <span class="x-span"><slot></slot></span>
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

        // 把传进来的属性应用到元素上面去 
        this.applicationCSSStyle(this.shadowRoot, name, newValue);      

        // 根据属性改变确定要绑定的事件
        let htmlElement = this.shadowRoot;
        let condition = parseInt(this.getAttribute('data-effect-type'));
        this.visualEffect(htmlElement, condition);

         
    }

    // 实现一些视觉效果
    visualEffect(element, effectType) {
        switch (effectType) {
            case 0:
                break;
            case 1:
                this.addEventListener('mouseover', (event) => {
                    element.querySelector('.x-button').classList.add('shadow');
                });
                this.addEventListener('mouseout', (event) => {
                    element.querySelector('.x-button').classList.remove('shadow');
                });
                this.addEventListener('mousedown', (event) => {
                    element.querySelector('.x-button').classList.remove('shadow');
                });
                this.addEventListener('mouseup', (event) => {
                    element.querySelector('.x-button').classList.add('shadow');
                });
                break;
            case 3:
                break;
            default:
                break;
        }

    }

    // 把传进来的属性应用到元素上面去
    applicationCSSStyle(element, attr, value) {
        
        switch (attr) {
            case 'data-color':
                element.querySelector('.x-button').style.color = value;
                // element.querySelector('.x-button').setAttribute(attr.substring(attr.indexOf('-') + 1),  value);                
                break;
            case 'data-background-color':
                element.querySelector('.x-button').style.backgroundColor = value;
                // element.querySelector('.x-button').style.cssText += attr.substring(attr.indexOf('-') + 1) + ': ' + value + ';';  // 这样也是可以设置的 
                // element.querySelector('.x-button').setAttribute(attr.substring(attr.indexOf('-') + 1),  value); // 这样设置不可以, setAttribute第一次用的时候可以，第二次就不行了
                break;
            case 'data-effect-type':
                break;
            case 'data-elevation':
                value == '1' ? element.querySelector('.x-button').classList.add('shadow') : element.querySelector('.x-button').classList.remove('shadow');
                break;
            default:
                break;
        }

        

        // attrs.forEach((attr) => {
        //     console.log(attr + ": " + htmlElement.getAttribute(attr));
        // });
    }
}

window.customElements.define('x-button', XButton);




// function test(el) {
//     let shadow2 = el.shadowRoot;
//     Array.from(shadow2.childNodes).forEach(child => {
//         console.log(child.nodeName)
//     });   
// }