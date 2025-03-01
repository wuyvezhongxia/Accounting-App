import { showConfirmDialog } from 'vant'; showConfirmDialog({ title: '标题', message:
'如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。', }) .then(() => { // on
confirm }) .catch(() => { // on cancel });
