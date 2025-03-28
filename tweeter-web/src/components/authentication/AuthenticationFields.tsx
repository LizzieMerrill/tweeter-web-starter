import "bootstrap/dist/css/bootstrap.css";

interface Props {
    alias: string;
    setAlias: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    doEntry: () => Promise<void>;
}

const AuthenticationFields = ({ alias, setAlias, password, setPassword, doEntry }: Props) => {
    const checkSubmitButtonStatus = (): boolean => {
        return !alias || !password;
    };

    const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" && !checkSubmitButtonStatus()) {
            doEntry();
        }
    };

    return (
        <>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    size={50}
                    id="aliasInput"
                    aria-label="alias"
                    placeholder="name@example.com"
                    onKeyDown={registerOnEnter}
                    onChange={(event) => setAlias(event.target.value)}
                    value={alias}
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control bottom"
                    id="passwordInput"
                    aria-label="password"
                    placeholder="Password"
                    onKeyDown={registerOnEnter}
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    );
};

export default AuthenticationFields;
