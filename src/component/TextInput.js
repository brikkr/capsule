var caps = require("..")

var TextInput = {
    label: "",

    oninit: function(vnode) {
        this.label = vnode.attrs.label
        this.value = vnode.attrs.value
        console.log(this.value)
        this.class = "div.field";
        if(this.value){
            this.class = "div.field.filled";
        }
    },
    view: function(vnode) {
        return caps(this.class, [caps("input", { 
            value: vnode.attrs.value,

            oninput: e => {
                e.preventDefault;
                if(e.target.value){
                    e.srcElement.parentElement.classList.add(
                        'filled',
                      )
                }else{
                    e.srcElement.parentElement.classList.remove(
                        'filled',
                      )
                }
                vnode.attrs.value = e.target.value
                vnode.attrs.error && validate()
            }
        }),caps("label", vnode.attrs.label)] )
    }
}


module.exports = TextInput
