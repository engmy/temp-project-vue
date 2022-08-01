import store from '../store/index.js'

// 用来控制按钮的显示
export function hasBtnPermission(permission)
{
  debounce(permissionFun(permission));
}

function permissionFun(permission) {
  // 查询多权限的 若查询到了有一个 就返回正确 减少循环
  let flage = permission.split('&').filter(p => {
    return store.getters.permList.indexOf(p) > -1
  })
  console.log('flage:', flage)
  return true;
}

// 防抖
function debounce(func, delay = 500) {
  let timeout;
  return function () {
    let context = this; // 指向全局
    let args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(context, args); // context.func(args)
    }, delay);
  };
}
