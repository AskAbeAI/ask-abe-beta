import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Node } from '@/lib/threejs/types';

interface Paragraph {
  text: string;
  index: number;
}

export interface NodeText {
  paragraphs: { [key: string]: Paragraph };
}

interface NodeTextHUDProps {
  node_text: NodeText | null;
}

const NodeTextHUD: React.FC<NodeTextHUDProps> = ({ node_text }) => {
  if (!node_text) {
    return null;
  }

  const paragraphsArray = Object.entries(node_text.paragraphs).map(([id, paragraph]) => ({
    id,
    ...paragraph
  }));

  // Sort paragraphs by their index
  paragraphsArray.sort((a, b) => a.index - b.index);

  return (
    <div className="absolute top-10 left-1 z-50 max-w-md p-4 bg-gray-100">
      {paragraphsArray.map(({ id, text }) => (
        <Card key={id} className="bg-white shadow-lg rounded-lg overflow-hidden my-2">
          <CardHeader>
            <CardTitle>{id}</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>{text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NodeTextHUD;