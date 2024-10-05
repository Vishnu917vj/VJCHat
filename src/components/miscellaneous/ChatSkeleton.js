import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ChatSkeleton = () => {
  return (
    <div>
      <Skeleton count={1} height={50} width={200} style={{ marginBottom: 10 ,float:'left'}} />
      <Skeleton count={1} height={30} width={150} style={{ marginBottom: 10 ,float:'left'}} />
      <Skeleton count={1} height={50} width={250} style={{ marginBottom: 10, float: 'right' }} />
      <Skeleton count={1} height={30} width={180} style={{ marginBottom: 10, float: 'right' }} />
      <Skeleton count={1} height={50} width={200} style={{ marginBottom: 10 ,float:'left'}} />
      <Skeleton count={1} height={30} width={150} style={{ marginBottom: 10 ,float:'left'}} />
    </div>
  );
};

export default ChatSkeleton;
