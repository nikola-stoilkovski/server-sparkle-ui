
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Note } from '@/types';
import { formatDate, truncateText } from '@/lib/utils';

const { Title, Paragraph, Text } = Typography;

interface NoteItemProps {
  note: Note;
  index: number;
  onDelete: (id: string) => void;
}

const NoteItem = ({ note, index, onDelete }: NoteItemProps) => {
  const navigate = useNavigate();
  
  const handleView = () => {
    navigate(`/note/${note.id}`);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit/${note.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  return (
    <Card 
      hoverable
      style={{ 
        marginBottom: 16,
        animation: `fadeIn 0.3s ease-in-out forwards`,
        animationDelay: `${index * 0.05}s`
      }}
      onClick={handleView}
      actions={[
        <Button key="edit" type="text" icon={<EditOutlined />} onClick={handleEdit}>Edit</Button>,
        <Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={handleDelete}>Delete</Button>
      ]}
    >
      <Title level={4}>{note.title}</Title>
      <Paragraph type="secondary">
        {truncateText(note.content, 150)}
      </Paragraph>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {formatDate(note.updatedAt)}
      </Text>
    </Card>
  );
};

export default NoteItem;
