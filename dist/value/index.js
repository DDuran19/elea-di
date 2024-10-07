import Injectable from "../injectable";
export class Value extends Injectable {
    static _dependencies = [];
    constructor(value) {
        super();
        return value;
    }
}
export default Value;
