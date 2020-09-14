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

        .x-span {
            -webkit-user-select: none;
            user-select: none;
        }

        .shadow {
            box-shadow: 5px 5px 5px gray;
        }
    </style>
    <div class="x-button">
        <button class="x-span"><slot></slot></button>
    </div>
    `;
// <button class="x-button" type="button"><slot></slot></button>   
class XButton extends HTMLElement {
    // 自定义组件的属性
    static get observedAttributes() {
        return ["data-effect-type", 'data-size'];
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
        //     // console.log(typeof(this.getAttribute('data-effect-type')))
        // });
        // this.addEventListener('mousedown', (event) => {
        //     console.log(event.type);
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

        // 根据属性改变确定要绑定的事件
        let condition = parseInt(this.getAttribute('data-effect-type'));
        switch (condition) {
            case 0:
                break;
            case 1:
                this.addEventListener('mouseover', (event) => {
                    console.log(event.type);
                    this.shadowRoot.querySelector('.x-button').classList.add('shadow');
                });
                this.addEventListener('mouseout', (event) => {
                    console.log(event.type);
                    this.shadowRoot.querySelector('.x-button').classList.remove('shadow');
                });
                break;
            case 2:
                break;
            case 3:
                break
            default:
                break;
        }
    }

}

window.customElements.define('x-button', XButton);


// .x-button:hover {
//     background-color: #336CAB;
// }

// function test(el) {
//     let shadow2 = el.shadowRoot;
//     Array.from(shadow2.childNodes).forEach(child => {
//         console.log(child.nodeName)
//     });   
// }