export interface PushVariables {
  variableName?: string;
}

export const getPushMessages = (variables?: PushVariables) => {
  const pushMessages = [
    {
      type: 'TEST',
      title: 'Push 알림 테스트',
      body: 'Push 알림 테스트입니다.',
    },
  ];
  return pushMessages;
};
