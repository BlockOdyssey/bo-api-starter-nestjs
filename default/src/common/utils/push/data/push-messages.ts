export interface PushVariables {
  variableName?: string;
}

export const getPushMessage = (type: string, variables?: PushVariables) => {
  const pushMessages = [
    {
      type: 'TEST',
      title: 'Push 알림 테스트',
      body: 'Push 알림 테스트입니다.',
    },
  ];
  for (let i in pushMessages) {
    if (type === pushMessages[i].type) return pushMessages[i];
  }
  return null;
};
