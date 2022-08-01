import storage from '@/utils/storage'
import { elMessage } from 'element-plus'
import { getPermissionList } from "@/api/perm";

const state = () => ({
    permList: storage.get('permList') || [],
})

const mutations =
{
    SET_PERM_GROUP(state, list)
    {
        state.permList = list;
        storage.set('permList', list)
    }
}

const actions =
{
    async getPermList({ commit })
    {
        return new Promise((resolve, reject) =>
        {
            getPermissionList().then((result) =>
            {
                const perm = result.data;
                commit('SET_PERM_GROUP', perm);
                resolve(perm);
            }).catch((err) =>
            {
                elMessage.error({ message: '权限加载异常', type: 'error'})
                reject(err)
            })
        })
    }
}

export default { namespaced: true, state: state, actions: actions, mutations: mutations }
