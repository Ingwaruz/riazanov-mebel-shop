import { useState, useEffect } from 'react';
import { $host } from '../../../shared/api';

const useContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchContacts = async () => {
            try {
                setLoading(true);
                const { data } = await $host.get('/api/contacts?active=true');
                
                if (mounted) {
                    // Группируем контакты по типу для удобства использования
                    const groupedContacts = data.reduce((acc, contact) => {
                        if (!acc[contact.type]) {
                            acc[contact.type] = [];
                        }
                        acc[contact.type].push(contact);
                        return acc;
                    }, {});
                    
                    setContacts({
                        all: data,
                        grouped: groupedContacts,
                        phones: groupedContacts.phone || [],
                        emails: groupedContacts.email || [],
                        addresses: groupedContacts.address || [],
                        socials: groupedContacts.social || [],
                        messengers: groupedContacts.messenger || []
                    });
                    setError(null);
                }
            } catch (err) {
                console.error('Error fetching contacts:', err);
                if (mounted) {
                    setError(err.message || 'Ошибка при загрузке контактов');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchContacts();

        return () => {
            mounted = false;
        };
    }, []);

    // Функция для получения первого контакта определенного типа
    const getFirstContact = (type) => {
        return contacts.grouped?.[type]?.[0] || null;
    };

    // Функция для получения всех контактов определенного типа
    const getContactsByType = (type) => {
        return contacts.grouped?.[type] || [];
    };

    return {
        contacts: contacts.all || [],
        contactsGrouped: contacts.grouped || {},
        phones: contacts.phones || [],
        emails: contacts.emails || [],
        addresses: contacts.addresses || [],
        socials: contacts.socials || [],
        messengers: contacts.messengers || [],
        loading,
        error,
        getFirstContact,
        getContactsByType
    };
};

export default useContacts; 