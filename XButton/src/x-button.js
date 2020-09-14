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
        return ["data-effect-type", 'data-background-color', 'data-foreground-color', 'data-size'];
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
        console.log(this)
        console.log("Web Component insert.");
    }

    disconnectedCallback() {
        console.log("Web Component remove.");
    }

    adoptedCallback() {
        console.log("Web Component remove to new DOM.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Web Component Attribute ' + name + ': ' + oldValue + ', ' + newValue);

        console.log(']]]]]]]]]]]' + name + this.shadowRoot.querySelector('.x-button').getAttribute(name) + ';')
        this.shadowRoot.querySelector('.x-button').style.cssText=name + newValue + ';'

        this.shadowRoot.querySelector('.x-button').setAttribute(name, newValue);
        // console.log('------ ' + this.shadowRoot.querySelector('.x-button').getAttribute('data-background-color'));
        //box.style.cssText="border:5px solid black; width:400px; height:200px;"

        // this.shadowRoot.querySelector('.x-button').style.cssText='background-color: ' 
        // + this.shadowRoot.querySelector('.x-button').getAttribute('data-background-color') + ';'

        // 根据属性改变确定要绑定的事件
        let htmlElement = this.shadowRoot;
        let condition = parseInt(this.getAttribute('data-effect-type'));
        this.visualEffect(htmlElement, condition);

        // 把传进来的属性应用到元素上面去  
        // this.applicationAttributes(htmlElement.querySelector('.x-button'), attrs);
    }

    // 实现一些视觉效果
    visualEffect(htmlElement, effectType) {
        switch (effectType) {
            case 0:
                break;
            case 1:
                this.addEventListener('mouseover', (event) => {
                    htmlElement.querySelector('.x-button').classList.add('shadow');
                });
                this.addEventListener('mouseout', (event) => {
                    htmlElement.querySelector('.x-button').classList.remove('shadow');
                });
                this.addEventListener('mousedown', (event) => {
                    htmlElement.querySelector('.x-button').classList.remove('shadow');
                });
                this.addEventListener('mouseup', (event) => {
                    htmlElement.querySelector('.x-button').classList.add('shadow');
                });
                break;
            case 2:
                htmlElement.querySelector('.x-button').classList.add('shadow');
                this.addEventListener('mousedown', (event) => {
                    htmlElement.querySelector('.x-button').classList.remove('shadow');
                });
                this.addEventListener('mouseup', (event) => {
                    htmlElement.querySelector('.x-button').classList.add('shadow');
                });
                break;
            case 3:
                break;
            default:
                break;
        }

    }

    // 把传进来的属性应用到元素上面去
    applicationAttributes(htmlElement, attrs) {
        attrs.forEach((attr) => {
            console.log(attr + ": " + htmlElement.getAttribute(attr));
        });
    }
}

window.customElements.define('x-button', XButton);




// function test(el) {
//     let shadow2 = el.shadowRoot;
//     Array.from(shadow2.childNodes).forEach(child => {
//         console.log(child.nodeName)
//     });   
// }