import CustomButton from "../components/CustomButton";

function SingUp() {
    return (
        <form>
            <h2 class="SignUpTitle">Registro de Usuario</h2>
            <label class="SignUpEmail" for="Email">Correo electrónico:</label>
            <br/>
            <input class="SignUpInputEmail" type="email" name="Email" placeholder="Correo" required />
            <br/>
            <label class="SignUpName" for="Name">Nombre:</label>
            <br/>
            <input class="SignUpInputName" type="text" name="Name" placeholder="Nombre" required />
            <br/>
            <label class="SignUpLastName" for="LastName">Apellido:</label>
            <br/>
            <input class="SignUpInputLastName" type="text" name="LastName" placeholder="Primer Apellido"required />
            <br/>
            <label class="SignUpPassword" for="Password">Contraseña:</label>
            <br/>
            <input class="SignUpInputPassword" type="password" name="Password" placeholder="Contraseña" required />
            <br/>
            <CustomButton
                text="Registrar"
                type="submit"
                id="SignUpButton"
            />
        </form>
    );
}

export default SingUp;