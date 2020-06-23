 Features.register({"name":"Knowledge","code":"knowledge","version":"1.2.4","category":"social","model":"Knowledge_Model_Knowledge","desktop_uri":"knowledge\/application\/","routes":[{"root":true,"state":"knowledge-list","controller":"KnowledgeListController","url":"knowledge\/mobile_list\/index\/value_id\/:value_id","template":"l1\/list.html","cache":false},{"state":"knowledge-edit","controller":"KnowledgeEditController","url":"knowledge\/mobile_edit\/index\/value_id\/:value_id\/edit_id\/:edit_id","template":"l1\/edit.html","cache":false},{"state":"knowledge-view","controller":"KnowledgeViewController","url":"knowledge\/mobile_view\/index\/value_id\/:value_id\/post_id\/:post_id","template":"l1\/view.html","cache":false},{"state":"knowledge-answer","controller":"KnowledgeAnswerController","url":"knowledge\/mobile_answer\/index\/value_id\/:value_id\/post_id\/:post_id\/edit_id\/:edit_id\/answer_id\/:answer_id\/reply_id\/:reply_id\/first_level\/:first_level","template":"l1\/answer.html","cache":false},{"state":"knowledge-reply","controller":"KnowledgeReplyController","url":"knowledge\/mobile_reply\/index\/value_id\/:value_id\/post_id\/:post_id\/comment_id\/:comment_id\/first_level\/:first_level","template":"l1\/reply.html","cache":false}],"icons":["icons\/knowledge-1.png","icons\/knowledge-2.png"],"files":["js\/controllers\/knowledge.js","js\/factory\/knowledge.js","js\/filters\/limitcharacter.js","scss\/knowledge.scss"],"is_ajax":true,"compile":true,"use_account":true,"only_once":false}, ['./features/knowledge/knowledge.bundle.min.js']); 