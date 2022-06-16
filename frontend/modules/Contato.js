import validator from "validator";

export default class Contato {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const nomeInput = el.querySelector('input[name="nome"]');
        const sobrenomeInput = el.querySelector('input[name="sobrenome"]');
        const emailInput = el.querySelector('input[name="email"]');
        const telefoneInput = el.querySelector('input[name="telefone"]');
        let error = false;

        if (!nomeInput.value.length > 0) {
            alert('Nome é um campo obrigatório.');
            error = true;
        }

        if (emailInput.value && !validator.isEmail(emailInput.value)) {
            alert('E-mail inválido');
            error = true;
        }

        if (!emailInput.value && !telefoneInput.value) {
            alert('Pelo menos um campo deve ser prenchido: email ou telefone.');
            error = true;
        }

        // if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
        //     alert('Senha precisa ter entre 3 e 50 caracteres.');
        //     error = true;
        // }

        if (!error) el.submit();
    }

}