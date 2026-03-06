import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FiSearch,
    FiUser,
    FiShield,
    FiMail,
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
    FiRefreshCw,
} from 'react-icons/fi';
import { fetchAllUsers, updateUserRole } from '../../store/slices/userSlice';
import Loader from '../../components/atoms/Loader';
import ConfirmModal from '../../components/atoms/ConfirmModal';
import toast from 'react-hot-toast';

const UserList = () => {
    const dispatch = useDispatch();
    const { users, loading, totalPages, totalUsers, updatingId } = useSelector(
        (state) => state.users
    );
    const { user: currentUser } = useSelector((state) => state.auth);

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        userId: null,
        userName: '',
        currentRole: '',
        newRole: '',
    });

    useEffect(() => {
        dispatch(fetchAllUsers({ page, keyword: searchTerm }));
    }, [dispatch, page, searchTerm]);

    const openRoleConfirm = (userId, userName, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setConfirmModal({
            isOpen: true,
            userId,
            userName,
            currentRole,
            newRole,
        });
    };

    const closeModal = () => {
        if (!updatingId) {
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
    };

    const handleConfirmToggle = async () => {
        const { userId, newRole } = confirmModal;
        try {
            await dispatch(updateUserRole({ id: userId, role: newRole })).unwrap();
            toast.success(`Role updated to ${newRole}`);
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch (err) {
            toast.error(err || 'Failed to update role');
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
    };

    const renderUserRow = (u) => {
        const isCurrentUser = u._id === currentUser?._id;
        const isUpdating = updatingId === u._id;
        const hasAvatar = u.avatar?.url && !u.avatar.url.includes('default');

        return (
            <tr key={u._id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200 uppercase font-bold overflow-hidden">
                            {hasAvatar ? (
                                <img
                                    src={u.avatar.url}
                                    alt={u.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.parentElement) {
                                            e.target.parentElement.textContent = u.name.charAt(0);
                                        }
                                    }}
                                />
                            ) : (
                                u.name.charAt(0)
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-neutral-900">
                                {u.name}{' '}
                                {isCurrentUser && (
                                    <span className="text-[10px] bg-neutral-900 text-white px-1.5 py-0.5 rounded-md ml-1 font-black uppercase tracking-tighter">
                                        You
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-neutral-400 flex items-center gap-1">
                                <FiMail className="scale-90" /> {u.email}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${u.role === 'admin'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                    >
                        {u.role === 'admin' ? <FiShield /> : <FiUser />}
                        {u.role}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <p className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                        <FiCalendar className="text-neutral-300" />
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </p>
                </td>
                <td className="px-6 py-4 text-right">
                    {!isCurrentUser && (
                        <button
                            onClick={() => openRoleConfirm(u._id, u.name, u.role)}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded-xl hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all active:scale-95 group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-50 disabled:hover:text-neutral-600 disabled:hover:border-neutral-200"
                        >
                            <FiRefreshCw
                                className={`${isUpdating
                                        ? 'animate-spin'
                                        : 'group-hover/btn:rotate-180'
                                    } transition-transform duration-500`}
                            />
                            <span className="text-xs font-black uppercase tracking-widest">
                                {isUpdating ? 'Updating...' : 'Toggle Role'}
                            </span>
                        </button>
                    )}
                </td>
            </tr>
        );
    };

    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="4" className="py-20 text-center">
                        <Loader />
                    </td>
                </tr>
            );
        }
        if (users.length === 0) {
            return (
                <tr>
                    <td colSpan="4" className="py-20 text-center text-neutral-400 font-bold">
                        No users found
                    </td>
                </tr>
            );
        }
        return users.map(renderUserRow);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-neutral-900">
                        Manage Users
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Total {totalUsers} registered users
                    </p>
                </div>
                <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-neutral-900 transition-all shadow-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined On</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {renderTableBody()}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                        <p className="text-sm text-neutral-500 font-medium">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="p-2 bg-white border border-neutral-200 rounded-xl shadow-sm disabled:opacity-50 hover:bg-white transition-all"
                            >
                                <FiChevronLeft />
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="p-2 bg-white border border-neutral-200 rounded-xl shadow-sm disabled:opacity-50 hover:bg-white transition-all"
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Role Toggle Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeModal}
                onConfirm={handleConfirmToggle}
                title="Change User Role"
                message={`Are you sure you want to change ${confirmModal.userName}'s role from ${confirmModal.currentRole?.toUpperCase()} to ${confirmModal.newRole?.toUpperCase()}? This will affect their access permissions.`}
                confirmText={`Make ${confirmModal.newRole?.toUpperCase()}`}
                cancelText="Cancel"
                variant="warning"
                loading={!!updatingId}
            />
        </div>
    );
};

export default UserList;
