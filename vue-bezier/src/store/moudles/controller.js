import {ParticleEmitter} from "three.quarks";
import {Object3D} from "three";

const state = {
    playSpeed: 1,
    toShow: false
}
const mutations = {
    setPlaySpeed(state, data) {
        state.playSpeed = data
    },
    toggleStatus(state, data){
        let flag = false
        if(data instanceof ParticleEmitter){
            flag = true
        }else if(data instanceof Object3D){
            data?.traverse(item => {
                if(item instanceof ParticleEmitter){
                    flag = true
                }
            })
        }
        state.toShow = flag
    }


}
const getters = {

}
const actions = {

}
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}