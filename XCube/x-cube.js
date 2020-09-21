// 这里必须命名为template, 否则会报错：Uncaught TypeError: Cannot read property 'cloneNode' of undefined
const template = document.createElement('template');

template.innerHTML = `
    <style type="text/css">
        .wrap {
            position: absolute;        
            perspective: 800px;
            perspective-origin: 50% 50%;
        }

        .cube {
            width: 200px;
            height: 200px;
            transform-style: preserve-3d;
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            animation: spin 8s infinite linear alternate;
            user-select: none;
        }

        .cube div {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 200px;
            height: 200px;
            text-transform: uppercase;
            background-color: rgba(255,20,147,.7);
            box-shadow: inset 5px 5px 30px rgba(0, 0, 0, .5);
        }

        .front {
            transform: translateZ(100px);
        }

        .back {
            transform: rotateY(180deg) translateZ(100px);
        }

        .left {
            transform: rotateY(-90deg) translateZ(100px);
        }

        .right {
            transform: rotateY(90deg) translateZ(100px);
        }

        .top {
            transform: rotateX(90deg) translateZ(100px);
        }

        .bottom {
            transform: rotateX(-90deg) translateZ(100px);
        }

        @keyframes spin {
            from {
                transform: rotateY(0);
            }

            to {
                transform: rotateY(360deg);
            }
        }
    </style>

    <div class="wrap">
        <div class="cube">
            <div class="front"></div>
            <div class="back"></div>
            <div class="left"></div>
            <div class="right"></div>
            <div class="top"></div>
            <div class="bottom"></div>
        </div>
    </div>
    `;

class XCube extends HTMLElement {
    // 自定义组件的属性
    static get observedAttributes() {
        return ['data-direct', 'data-text', 'data-img'];
    }

    constructor() {
        super();
        // 创建 shadow root
        let shadow = this.attachShadow({
            mode: 'open'
        });

        // 将 Shadow DOM 添加到 Shadow root 上
        shadow.appendChild(template.content.cloneNode(true));
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
        let shadowRoot = this.shadowRoot;

        this.applicationAttributes(shadowRoot, name, newValue);

    }

    // 把传进来的属性应用到元素上面去
    applicationAttributes(shadowRoot, attr, value) {
        let cube = shadowRoot.querySelector('.cube');  
        let sides = cube.children;
        // 更改CSS样式  
        switch (attr) {
            case 'data-img': // 背景图片                
                Array.from(sides).forEach((side) => {
                    let img = document.createElement('img');
                    img.setAttribute('src', value);
                    img.setAttribute('width', '100%');
                    img.setAttribute('height', '100%');
                    side.appendChild(img);
                })

                break;

            case 'data-text': // 每个面显示的文本
                let txtArray = value.split(',');
                Array.from(sides).forEach((side, index) => {
                    side.innerHTML = txtArray[index];
                })
                break;

            case 'data-direct': // 方向    
                let style = document.createElement('style');

                if (value == 'X') {
                    style.innerHTML =  `@keyframes spin {
                        from {
                            transform: rotateX(0);
                        }
            
                        to {
                            transform: rotateX(360deg);
                        }
                    }`;                   
                }

                if (value == 'Y') {
                    style.innerHTML =  `@keyframes spin {
                        from {
                            transform: rotateY(0);
                        }
            
                        to {
                            transform: rotateY(360deg);
                        }
                    }`;                   
                }

                if (value == 'Z') {
                    style.innerHTML =  `@keyframes spin {
                        from {
                            transform: rotateZ(0);
                        }
            
                        to {
                            transform: rotateZ(360deg);
                        }
                    }`;                   
                }

                if (value == 'XYZ') {
                    style.innerHTML =  `@keyframes spin {
                        from {
                            transform: rotate3d(0, 0, 0, 0deg);
                        }
            
                        to {
                            transform: rotate3d(1, 1, 1, 360deg);
                        }
                    }`;                   
                }

                shadowRoot.appendChild(style);
                break;

            default:
                break;
        }


    }
}

window.customElements.define('x-cube', XCube);



