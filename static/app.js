class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),

        }

        this.state = false;
        this.messages = [
            { name: "User", message: 'What is DSI Tire Factory known for?', link: true },
            { name: "User", message: 'Where is DSI Tire Factory located?', link: true },
            { name: "User", message: 'What types of tires does DSI Tire Factory offer?', link: true }
        ];
         this.premessages = [
            { name: "User", message: 'What is DSI Tire Factory known for?', link: true },
            { name: "User", message: 'Where is DSI Tire Factory located?', link: true },
            { name: "User", message: 'What types of tires does DSI Tire Factory offer?', link: true }
        ];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
            this.updateChatText(chatbox);
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        this.messages = this.messages.filter((e) => e.link === false );
        this.premessages = this.premessages.filter((e) => e.message !== text1);
        let msg1 = { name: "User", message: text1, link: false }
        this.messages.push(msg1);

        fetch('http://3.84.57.101:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "Sam", message: r.answer, link: false };
                this.messages.push(msg2);
                this.messages = [...this.messages, ...this.premessages];
                this.updateChatText(chatbox)
                textField.value = ''

            }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
        });
    }

    updateChatText(chatbox) {
        var html = '';
        const selectMsgs = []
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                if (item.link === true) {
                    const className = "select__msg__" + index;
                    selectMsgs.push(className)
                    html += '<div style="cursor: pointer" class="messages__item messages__item--operator select__messages__item">' +
                        '<a class=' + className + '>' + item.message + '</a>' +
                        '</div>'
                } else {
                    html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
                }
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;

        if (this.messages.find((e) => e.link)) {
            for (const selectMsg of selectMsgs) {
                const selectMsgX = document.querySelector('.' + selectMsg);
                selectMsgX.addEventListener('click', () => this.onSelect(chatbox,selectMsgX.innerText));
            }
        }

    }

    onSelect(chatbox, text1)  {
        var textField = chatbox.querySelector('input');
        if (text1 === "") {
            return;
        }

        this.messages = this.messages.filter((e) => e.link === false );
        let msg1 = { name: "User", message: text1, link: false };
        this.premessages = this.premessages.filter((e) => e.message !== text1);
        this.messages.push(msg1);


        fetch('http://3.84.57.101:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "Sam", message: r.answer, link: false };
                this.messages.push(msg2);
                this.messages = [...this.messages, ...this.premessages];
                this.updateChatText(chatbox)
                textField.value = ''

            }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
        });
        this.updateChatText(chatbox)
    }
}


const chatbox = new Chatbox();
chatbox.display();
