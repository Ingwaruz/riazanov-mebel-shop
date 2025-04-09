import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { Context } from '../../../index';
import './UserProfile.scss';

const UserProfile = () => {
    const { user } = useContext(Context);
    
    return (
        <Card className="user-profile">
            <Card.Body>
                <Card.Title>Профиль пользователя</Card.Title>
                <Card.Text>
                    <strong>Email:</strong> {user.user.email}
                </Card.Text>
                <Card.Text>
                    <strong>Роль:</strong> {user.user.role}
                </Card.Text>
                <Card.Text>
                    <strong>ID пользователя:</strong> {user.user.id}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default UserProfile; 