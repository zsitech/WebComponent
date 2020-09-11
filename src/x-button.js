// 这里必须命名为template, 否则会报错：Uncaught TypeError: Cannot read property 'cloneNode' of undefined
const template = document.createElement('template');

template.innerHTML=`
    <style type="text/css">
    :host {
        display: inline;
    }
    .x-button{
        color: white;
        width: 108px;
        height: 38px;
        background-color: #184C85;
        border-radius: 5px;
        outline: none;
        font: 16px "Microsoft YaHei";        
        border: none;
    }
    .x-button:hover{
        background-color: #336CAB;
    }
    </style>
    
    <button class="x-button" type="button"><slot></slot></button>    
    `;

class XButton extends HTMLElement {
    // 自定义组件的属性
    static get observedAttributes(){
        return ["text","value"];
    }

    constructor() {
        super();
        // 创建 shadow root
        let shadow = this.attachShadow( { mode: 'closed' } );        
        
        // 将 Shadow DOM 添加到 Shadow root 上
        shadow.appendChild(template.content.cloneNode(true));   // let content = template.content.cloneNode(true);
 
        // 这个写法和下面的效果一样
        // this.onclick = () =>{
        //     console.log('click me.');
        // };
        // 为组件添加事件
        this.addEventListener('click', () => {
            console.log('click me.' + this.getAttribute('text'));
        });
        this.addEventListener('mousedown', () => {
            console.log('mouse down.' + this.getAttribute('value'));
        });
    }

    connectedCallback(){
        console.log("组件插入到DOM");            
    }
    disconnectedCallback(){
        console.log("组件从DOM移除");
    }
    adoptedCallback(){
        console.log("组件移动到新的DOM");
    }
    attributeChangedCallback(name, oldValue, newValue){
        console.log('Attribute ' + name + ': ' + oldValue + ', ' + newValue);
        
    }
    
}

function test(el) {
    let shadow2 = el.shadowRoot;
    Array.from(shadow2.childNodes).forEach(child => {
        console.log(child.nodeName)
    });   
}
// window.CustomElementRegistry('x-button', XButton); 
window.customElements.define('x-button', XButton); 