import { ElLoading } from 'element-plus';

let loadingRequestCount = 0;
let loadingInstance;

const showLoading = (target) =>
{
    if (loadingRequestCount === 0)
    {
        loadingInstance = ElLoading.service({
            lock: true,
            text: '加载中, 请稍后.....',
            background: 'rgba(0, 0, 0, 0.7)'
        });
    }
    loadingRequestCount++
}

const hideLoading = () =>
{
    if (loadingRequestCount <= 0) return
    loadingRequestCount--
    if (loadingRequestCount === 0)
    {
        loadingInstance.close();
    }
}

export { showLoading, hideLoading }