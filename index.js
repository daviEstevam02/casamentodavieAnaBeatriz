
(async function() {
    const apiUrl =  'localhost:3000';
    const getTransmissionLinkUrl = 'https://prod-124.westus.logic.azure.com:443/workflows/1c8e1b831bcb47e7b4823b23fb9e3307/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_OCHCbHT3DfZeczsQZ_T5YXStf669-zoT8HsGdJW9Y4';
    const postPersonsUrl = 'https://prod-34.westus.logic.azure.com:443/workflows/331f2eedf8884f1f9eb1cac2959380ba/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XOcN4ZMMfJ3pmkjmJUufwN9wsbZm9FnRsFdlmQvfE7E';
    const url = new URL(window.location.href);
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
   

    const app = new Vue({
        el: '.app',
        data: {
            initialized: false,
            invitationOpened: false,
            showCompleteAddress: false,
            showMap: false,
            showPix: false,
            showInfos: false,
            focusField: '',
            preventShare: window.location.href.toLowerCase().indexOf('prevent-share') != -1,
            tag: url.searchParams.get('tag'),
            persons: [{
                name: '',
                cpf: ''
            }],
            // mailObj: {
            //     from: "daviestevam02@gmail.com",
            //     recipients: ["daviestevam02@gmail.com"],
            //     subject: senderName,
            //     message: messageSent,
            // },
            alert: {
                text: '',
                type: '',
                show: false
            },
            transmissionUrl: null,
            loading: false,
            message: {
                name: '',
                message: ''
            },
            timeout: null,
            music: document.getElementById('music'),
            musicMuted: false
        },
        created: async function () {
            const self = this;

            const delayInit = async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                self.initialized = true;
            };

            const getTransmissionLink = async () => {
                const transmissionUrl = await fetch(getTransmissionLinkUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        title: 'LinkTransmissao'
                    })
                }).then(_ => _.text());
    
                self.transmissionUrl = transmissionUrl;
            };

            await Promise.all([delayInit(), getTransmissionLink()]);
            this.music.oncanplay = function() {
                console.log('ok')
            };
        },

        methods: {
            openInvitation: function() {
                this.invitationOpened = true;
                this.music.play();
            },
            setAlert: function (text, type, show) {
                this.$set(this.alert, 'text', text);
                this.$set(this.alert, 'type', type);
                this.$set(this.alert, 'show', show);
            },
            showInfoAlert: function (text) {
                const self = this;
                this.setAlert(text, 'info', true);
                this.timeout = setTimeout(() => self.alert.show && self.$set(self.alert, 'show', false), 5000);
            },
            showDangerAlert: function (text) {
                const self = this;
                this.setAlert(text, 'danger', true);
                this.timeout = setTimeout(() => self.alert.show && self.$set(self.alert, 'show', false), 5000);
            },
            setLoading: function (show) {
                this.loading = show;
                this.setAlert(show && 'Carregando', show && 'info', show);
            },
            copyToClipboard: function (text) {
                const el = document.createElement('textarea');
                el.value = text;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            },
            copyPix: function () {
                this.copyToClipboard('12988536684');
                this.showInfoAlert('Chave Pix Copiada!');
            },
            copyTransmissionUrl: function () {
                if (this.transmissionUrl) {
                    this.copyToClipboard(this.transmissionUrl);
                    this.showInfoAlert('Link de Transmissão Copiado!');
                } else {
                    this.showDangerAlert('Link de Transmissão indisponível');
                }
            },
            openTransmissionUrl: function () {
                if (this.transmissionUrl) {
                    window.open(this.transmissionUrl, '_blank');
                } else {
                    this.showDangerAlert('Link de Transmissão indisponível');
                }
            },
            sendMessage: async function () {
                // if (!this.message.name)
                // return this.showDangerAlert('Preencha seu nome');
                // if (!this.message.message)
                //     return this.showDangerAlert('Preencha sua mensagem');

                // const urlEmailApi = `http://${apiUrl}/sendmail`

                // console.log(urlEmailApi)
                    
                // this.setLoading(true);
                
                // await fetch(urlEmailApi , {
                //     method: 'POST',
                //     headers,
                //     body: JSON.stringify(this.message)
                // });

                // this.setLoading(false);
                
                // this.message = {
                //     name: '',
                //     message: ''
                // };

                // await new Promise(resolve => setTimeout(resolve, 300));
                // this.showInfoAlert('Sua mensagem foi enviada!');
            },
            
            savePersons: async function () {

                const userApi = `http://${apiUrl}/users` 

                for (let person of this.persons) {
                    let index = this.persons.indexOf(person);
                    if (!person.name)
                        return this.showDangerAlert(`Nome de ${index == 0 ? 'Meus Dados' : 'Pessoa ' + index} inválido`);
                    if (!person.cpf)
                        return this.showDangerAlert(`CPF de ${index == 0 ? 'Meus Dados' : 'Pessoa ' + index} inválido`);

                    this.$set(person, 'cpf', person.cpf.toString().replace('.', ''));
                }

                this.setLoading(true);

                await fetch(userApi, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(this.persons)
                });

                this.setLoading(false);
                this.persons = [{
                    name: '',
                    cpf: ''
                }];

                await new Promise(resolve => setTimeout(resolve, 300));
                this.showInfoAlert('As inscrições foram realizadas!');
            },
            dismissAlert: function() {
                this.timeout && clearTimeout(this.timeout);
                this.timeout = null;
                this.setAlert('', '', false);
            },
            toggleSound: function() {
                this.music.muted = !this.music.muted;
                this.musicMuted = !this.musicMuted;
            }
        }
    });
})();
