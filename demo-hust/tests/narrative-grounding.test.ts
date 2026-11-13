import test from 'node:test';
import assert from 'node:assert/strict';
import {narrativeFactIssue} from '../src/lib/narrative-grounding';
test('withdrawn allocation cannot be described as a negative or positive declaration',()=>{
 assert.equal(narrativeFactIssue('Các nội dung hỗ trợ chưa được phân định riêng cho từng nguồn theo khai báo của bạn.',{}),'allocation_unknown');
 assert.equal(narrativeFactIssue('Các nguồn đã phân định rồi.',{}),'allocation_unknown');
});
test('known false is distinct from unknown and a positive contradictory claim',()=>{
 assert.equal(narrativeFactIssue('Các nguồn chưa phân định.',{allocation:false}),undefined);
 assert.equal(narrativeFactIssue('Các nguồn đã phân định.',{allocation:false}),'allocation_contradiction');
 assert.equal(narrativeFactIssue('Hoạt động không phục vụ nhiệm vụ.',{related:true}),'related_contradiction');
});
test('unknown relationship cannot be presented as a confirmed positive or negative',()=>{
 assert.equal(narrativeFactIssue('Hoạt động có phục vụ nhiệm vụ theo khai báo.',{}),'related_unknown');
 assert.equal(narrativeFactIssue('Hoạt động không liên quan đến đề tài.',{}),'related_unknown');
});
test('conditional source rules and explicit uncertainty remain valid',()=>{
 for(const text of ['Nếu chưa phân định, cần làm rõ từng nguồn.','Chưa rõ các nguồn đã phân định hay chưa.','Khi hoạt động không phục vụ nhiệm vụ, cần đối chiếu điều kiện riêng.','Cần biết hoạt động có phục vụ nhiệm vụ hay không.'])assert.equal(narrativeFactIssue(text,{}),undefined);
});
test('asking to establish a relationship does not assert it, while a later declaration still does',()=>{
 assert.equal(narrativeFactIssue('Để tiếp tục đối chiếu, tôi cần thêm thông tin xác định hoạt động có phục vụ nhiệm vụ hay không.',{}),undefined);
 assert.equal(narrativeFactIssue('Tôi cần thêm thông tin xác định ngày đi. Hoạt động có phục vụ nhiệm vụ.',{}),'related_unknown');
 assert.equal(narrativeFactIssue('Tôi cần thêm thông tin xác định hoạt động có phục vụ nhiệm vụ hay không. Hoạt động không phục vụ nhiệm vụ.',{related:true}),'related_contradiction');
});
