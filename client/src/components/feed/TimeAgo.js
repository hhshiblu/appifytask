'use client';

import { useEffect, useState } from 'react';
import { formatTimeAgo } from '../../actions/utils';

export default function TimeAgo({ date, className }) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!date) return;

    const update = () => setLabel(formatTimeAgo(date));
    update();

    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [date]);

  if (className) {
    return <span className={className}>{label}</span>;
  }

  return <>{label}</>;
}
