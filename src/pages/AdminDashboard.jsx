import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getProjects,
  deleteProject,
  toggleProjectStatus,
  updateProjectOrder,
  getQueries,
  deleteQuery,
  markQueryAsSeen,
  markAllQueriesAsSeen
} from '../services/projectService';
import {
  getSettings,
  addAdminEmail,
  removeAdminEmail,
  updateSettings
} from '../services/settingsService';
import ProjectForm from '../components/Admin/ProjectForm';
import { THEME_MAP } from '../themeConfig';

const AdminDashboard = () => {
  const { user, loading, isAdmin, isSuperAdmin, login, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'messages' | 'users'
  const [projects, setProjects] = useState([]);
  const [queries, setQueries] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState('idle');
  const [mapUrl, setMapUrl] = useState('');
  const [mapAddress, setMapAddress] = useState('');
  const [filterSource, setFilterSource] = useState('all'); // 'all' | 'form' | 'popup'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'phone' | 'both'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'replied' | 'unreplied'

  const [mapShape, setMapShape] = useState('rectangle'); // 'rectangle' | 'square'
  const [editingProject, setEditingProject] = useState(null);
  const [themeKey, setThemeKey] = useState(localStorage.getItem('adm-theme') || 'DEFAULT');
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, title: '', message: '', type: 'confirm', onConfirm: null
  });
  const [isNavOpen, setIsNavOpen] = useState(false);

  const unreadCount = queries.filter(q => !q.isSeen).length;

  const showAlert = (title, message) => {
    setModalConfig({ isOpen: true, title, message, type: 'alert', onConfirm: null });
  };

  const confirmAction = (title, message, onConfirm) => {
    setModalConfig({ isOpen: true, title, message, type: 'confirm', onConfirm });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const filteredQueries = queries.filter(q => {
    // 0. Search Filter (Partial matching N-gram style logic)
    const s = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      (q.name && q.name.toLowerCase().includes(s)) ||
      (q.email && q.email.toLowerCase().includes(s)) ||
      (q.phone && q.phone.toLowerCase().includes(s)) ||
      (q.message && q.message.toLowerCase().includes(s));

    if (!matchesSearch) return false;

    // 1. Filter by Source
    const matchesSource = filterSource === 'all' || q.source === filterSource;

    // 2. Filter by Contact Type
    const hasEmail = q.email && q.email !== 'Not provided';
    const hasPhone = q.phone && q.phone.trim() !== '';

    let matchesType = true;
    if (filterType === 'phone') matchesType = hasPhone && !hasEmail;
    else if (filterType === 'both') matchesType = hasPhone && hasEmail;

    // 3. Filter by Status
    let matchesStatus = true;
    if (filterStatus === 'replied') matchesStatus = q.isSeen === true;
    else if (filterStatus === 'unreplied') matchesStatus = q.isSeen === false;

    return matchesSource && matchesType && matchesStatus;
  }).sort((a, b) => {
    // Priority 1: Unseen (New) messages first
    if (a.isSeen !== b.isSeen) {
      return a.isSeen ? 1 : -1;
    }
    // Priority 2: Latest arrival first
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return timeB - timeA;
  });

  const fetchAdminProjects = async () => {
    setIsDataLoading(true);
    try {
      const data = await getProjects(true);
      setProjects(data);
    } catch (err) {
      console.error('Error fetching admin projects:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchAdminQueries = async () => {
    setIsDataLoading(true);
    try {
      const data = await getQueries();
      setQueries(data);
    } catch (err) {
      console.error('Error fetching admin queries:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchSettings = async () => {
    setIsDataLoading(true);
    try {
      const settings = await getSettings();
      setAdminList(settings.adminEmails || []);
      setSuperAdmins(settings.superAdminEmails || []);
      setMapUrl(settings.mapUrl || '');
      setMapAddress(settings.mapAddress || '');
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminProjects();
      fetchAdminQueries();
      if (isSuperAdmin) {
        fetchSettings();
      }
    }
  }, [isAdmin, isSuperAdmin]);

  const handleDeleteProject = (id) => {
    confirmAction(
      'Delete Project',
      'Are you sure you want to permanently delete this project?',
      async () => {
        setActionStatus('processing');
        try {
          await deleteProject(id);
          fetchAdminProjects();
        } catch (err) {
          console.error(err);
          showAlert('Error', 'Failed to delete project.');
        } finally {
          setActionStatus('idle');
        }
      }
    );
  };

  const handleDeleteQuery = (id) => {
    confirmAction(
      'Delete Message',
      'Are you sure you want to delete this message?',
      async () => {
        // Optimistic delete
        const previousQueries = [...queries];
        setQueries(prev => prev.filter(q => q.id !== id));

        try {
          await deleteQuery(id);
        } catch (err) {
          showAlert('Error', 'Failed to delete inquiry.');
          setQueries(previousQueries); // Revert on error
        }
      }
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const CopyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="1" ry="1"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );

  const handleMarkAsReplied = async (id) => {
    // Optimistic UI update
    setQueries(prev => prev.map(q => q.id === id ? { ...q, isSeen: true } : q));

    try {
      await markQueryAsSeen(id);
    } catch (err) {
      console.error('Failed to mark as replied:', err);
      fetchAdminQueries();
    }
  };

  const handleMarkAllAsReplied = () => {
    const unseenIds = queries.filter(q => !q.isSeen).map(q => q.id);
    if (unseenIds.length === 0) return;

    confirmAction(
      'Confirm Batch Action',
      `Are you sure you want to mark all ${unseenIds.length} new messages as replied?`,
      async () => {
        setQueries(prev => prev.map(q => ({ ...q, isSeen: true })));
        try {
          await markAllQueriesAsSeen(unseenIds);
        } catch (err) {
          console.error('Failed to mark all as replied:', err);
          fetchAdminQueries();
        }
      }
    );
  };

  const handleToggleVisibility = async (id, currentStatus) => {
    setActionStatus('processing');
    try {
      await toggleProjectStatus(id, !currentStatus);
      await fetchAdminProjects();
    } catch (err) {
      console.error('Visibility toggle error:', err);
    } finally {
      setActionStatus('idle');
    }
  };

  const handleReorder = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    setActionStatus('processing');
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap in array
    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];

    try {
      // Create order updates
      const updates = newProjects.map((p, i) => ({
        id: p.id,
        displayOrder: i * 10 // Space them out
      }));

      await updateProjectOrder(updates);
      setProjects(newProjects);
    } catch (err) {
      console.error('Reorder error:', err);
    } finally {
      setActionStatus('idle');
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    // Optional: add scroll to top logic if sidebar is long
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    setActionStatus('processing');
    try {
      await addAdminEmail(newAdminEmail);
      setNewAdminEmail('');
      await fetchSettings();
    } catch (err) {
      alert('Failed to add admin.');
    } finally {
      setActionStatus('idle');
    }
  };

  const handleRemoveAdmin = (email) => {
    if (superAdmins.some(sa => sa.toLowerCase() === email.toLowerCase())) {
      showAlert('Restricted Action', 'Cannot remove a Superadmin through this dashboard.');
      return;
    }

    confirmAction(
      'Remove Admin',
      `Are you sure you want to remove ${email} from admins?`,
      async () => {
        try {
          await removeAdminEmail(email);
          fetchSettings();
        } catch (err) {
          console.error(err);
          showAlert('Error', 'Failed to remove admin.');
        }
      }
    );
  };

  const handleUpdateMap = async (e) => {
    e.preventDefault();
    setActionStatus('processing');
    try {
      await updateSettings({ mapUrl, mapAddress });
      showAlert('Success', 'Map settings updated successfully!');
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Failed to update map settings.');
    } finally {
      setActionStatus('idle');
    }
  };

  if (loading) return <div className="admin-container text-center"><p>Checking authentication...</p></div>;

  if (!user) {
    return (
      <div className="admin-portal-login">
        <div className="gatekeeper-card">
          <h2 className="mb-1">ADMIN PORTAL</h2>
          <div className="legal-warning mb-2">
            <p className="small"><strong>RESTRICTED ACCESS</strong></p>
            <p className="small">This is a private administrative system. Unauthorized access attempts are actively monitored, logged, and may result in legal action.</p>
          </div>
          <p className="mb-2 text-muted">Please log in to manage the portfolio.</p>
          <button onClick={login} className="button-primary w-100">Login with Google</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-portal-login">
        <div className="gatekeeper-card">
          <h2 className="mb-1">UNAUTHORIZED</h2>
          <div className="legal-warning mb-2 error">
            <p className="small"><strong>ACCESS DENIED</strong></p>
            <p className="small">Your account (<strong>{user.email}</strong>) is not authorized for this administrative portal.</p>
          </div>
          <p className="mb-2 small text-muted">To gain access, ensure this email is added to the <strong>adminEmails</strong> list in Firestore.</p>
          <button onClick={logout} className="button-primary w-100">Logout</button>
        </div>
      </div>
    );
  }

  // Get active theme tokens
  const activeTheme = THEME_MAP[themeKey] || THEME_MAP.DEFAULT;

  return (
    <div className="admin-dashboard-page" style={{
      '--adm-p': activeTheme.primary,
      '--adm-p-l': activeTheme.primaryLight,
      '--adm-bg': activeTheme.bgMain,
      '--adm-card': activeTheme.bgCard,
      '--adm-head': activeTheme.bgHeader,
      '--adm-radius': activeTheme.radius,
      '--adm-text': activeTheme.textMain,
      '--adm-muted': activeTheme.textMuted,
      '--adm-text-l': activeTheme.textLight,
      '--adm-text-h': activeTheme.textHeading,
      '--adm-border': activeTheme.borderMain,
      '--adm-border-m': activeTheme.borderMuted,
      '--adm-border-l': activeTheme.borderLight,
      '--adm-scroll': activeTheme.scrollbarTrack,
      '--adm-new-t': activeTheme.status.newText,
      '--adm-new-bg': activeTheme.status.newBg,
      '--adm-rep-t': activeTheme.status.repliedText,
      '--adm-rep-bg': activeTheme.status.repliedBg,
      '--adm-rep-body': activeTheme.status.repliedBody,
      '--adm-rep-bor': activeTheme.status.repliedBorder,
      '--adm-del': activeTheme.status.delete,
      '--adm-del-h': activeTheme.status.deleteHover,
      '--adm-pop-t': activeTheme.sources.popup.text,
      '--adm-pop-bg': activeTheme.sources.popup.bg,
      '--adm-pop-bor': activeTheme.sources.popup.border,
      '--adm-form-t': activeTheme.sources.form.text,
      '--adm-form-bg': activeTheme.sources.form.bg,
      '--adm-form-bor': activeTheme.sources.form.border,
      '--adm-call-t': activeTheme.sources.call.text,
      '--adm-call-bg': activeTheme.sources.call.bg,
      '--adm-call-bor': activeTheme.sources.call.border,
      '--adm-h-tab': activeTheme.hover.tab,
      '--adm-h-filter': activeTheme.hover.filter,
      '--adm-h-light': activeTheme.hover.bgLight
    }}>
      <header className="admin-header">
        <button
          className="menu-toggle"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle navigation"
        >
          <div className={`hamburger ${isNavOpen ? 'open' : ''}`}>
            <span></span><span></span><span></span>
          </div>
        </button>

        <div className="admin-logo">
          <span className="logo-box">AT</span>
          <span className="logo-text">ADMIN</span>
        </div>

        {isNavOpen && <div className="nav-overlay" onClick={() => setIsNavOpen(false)}></div>}

        <div className={`admin-nav-main ${isNavOpen ? 'mobile-open' : ''}`}>
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => { setActiveTab('projects'); setIsNavOpen(false); }}
            >
              PROJECTS
            </button>
            <button
              className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => { setActiveTab('messages'); setIsNavOpen(false); }}
            >
              MESSAGES {unreadCount > 0 && <span className="new-tag">{unreadCount} NEW</span>}
            </button>
            {isSuperAdmin && (
              <button
                className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => { setActiveTab('users'); setIsNavOpen(false); }}
              >
                USERS
              </button>
            )}
            {isSuperAdmin && (
              <button
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => { setActiveTab('settings'); setIsNavOpen(false); }}
              >
                SETTINGS
              </button>
            )}
          </div>
          <button onClick={logout} className="action-btn pro">LOGOUT</button>
        </div>
      </header>

      {activeTab === 'projects' ?
        <div className="admin-grid">
          <div className="admin-panel glass-card">
            <h3 className="left-panel-title">
              {editingProject ? 'EDIT PROJECT' : 'ADD NEW PROJECT'}
            </h3>
            <p className="small text-muted mb-2">
              {editingProject
                ? `Modifying "${editingProject.title}"`
                : 'Publish a new build or design project to your portfolio.'}
            </p>
            <ProjectForm
              onProjectAdded={() => {
                fetchAdminProjects();
                setEditingProject(null);
              }}
              editingProject={editingProject}
              onCancel={() => setEditingProject(null)}
            />
          </div>

          <div className="admin-panel">
            <h3 className="section-title">PROJECT MANAGEMENT</h3>
            <div className="messages-list">
              {projects.length === 0 && !isDataLoading ? (
                <p className="text-center py-4 text-muted">No projects found.</p>
              ) : (
                projects.map((project, index) => (
                  <div key={project.id} className={`message-card ${project.isDisabled ? 'seen' : ''}`}>
                    <div className="message-header" style={{ padding: '0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Left Side: Image */}
                      <div className="project-thumbnail-large">
                        <img src={project.imageUrl} alt={project.title} />
                      </div>

                      {/* Content Area: Status -> Title -> Description */}
                      <div style={{ minWidth: 0, padding: '0.75rem 0.25rem' }}>
                        <div className="flex items-center gap-1 mb-min">
                          <span className={`badge-pro ${project.isDisabled ? 'muted' : 'active'}`} style={{ fontSize: '0.65rem' }}>
                            {project.isDisabled ? 'HIDDEN' : 'VISIBLE'}
                          </span>
                          <h4 style={{ margin: 0, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {project.title}
                          </h4>
                          <span className="text-muted" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                            {project.createdAt?.toDate ? project.createdAt.toDate().toLocaleDateString('en-GB') : 'New'}
                          </span>
                        </div>

                        {project.description && (
                          <p style={{
                            margin: 0,
                            fontSize: '0.85rem',
                            color: 'var(--adm-muted)',
                            lineHeight: '1.3',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {project.description}
                          </p>
                        )}

                        {project.link && (
                          <a href={project.link} target="_blank" rel="noreferrer" className="reply-hint" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                            Live Site ↗
                          </a>
                        )}
                      </div>

                      {/* Right side: Actions & Reorder */}
                      <div className="flex items-center gap-min" style={{ paddingRight: '1rem', marginLeft: 'auto' }}>
                        <div className="order-controls mr-1">
                          <button
                            className="order-btn"
                            disabled={index === 0 || actionStatus === 'processing'}
                            onClick={() => handleReorder(index, 'up')}
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            className="order-btn"
                            disabled={index === projects.length - 1 || actionStatus === 'processing'}
                            onClick={() => handleReorder(index, 'down')}
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>
                        <div className="action-btns-flex">
                          <button
                            onClick={() => handleEditClick(project)}
                            disabled={actionStatus === 'processing'}
                            className="action-btn-pro"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleToggleVisibility(project.id, project.isDisabled)}
                            disabled={actionStatus === 'processing'}
                            className="action-btn-pro"
                          >
                            {project.isDisabled ? 'SHOW' : 'HIDE'}
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={actionStatus === 'processing'}
                            className="action-btn-pro delete"
                          >
                            DEL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        : activeTab === 'messages' ?
          <div className="admin-grid">
            <div className="admin-panel glass-card p-2">
              <h3 className="left-panel-title">FILTERS</h3>
              <p className="small text-muted mb-1">Manage leads from your contact form and popups.</p>

              <div className="filter-manager">
                <label className="section-title-xs">Search Inquiries</label>
                <div className="form-group mb-2">
                  <input
                    type="text"
                    placeholder="Search by name, email, msg..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="modern-input"
                    // style={{ height: '36px', fontSize: '0.85rem' }}
                    autoComplete="off"
                  />
                </div>

                <label className="section-title-xs">Filter by Status</label>
                <div className="source-filter-bar mb-1">
                  <button className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>All</button>
                  <button className={`filter-btn ${filterStatus === 'unreplied' ? 'active' : ''}`} onClick={() => setFilterStatus('unreplied')}>New</button>
                  <button className={`filter-btn ${filterStatus === 'replied' ? 'active' : ''}`} onClick={() => setFilterStatus('replied')}>Replied</button>
                </div>

                <label className="section-title-xs">Filter by Source</label>
                <div className="source-filter-bar mb-1">
                  <button className={`filter-btn ${filterSource === 'all' ? 'active' : ''}`} onClick={() => setFilterSource('all')}>All</button>
                  <button className={`filter-btn ${filterSource === 'form' ? 'active' : ''}`} onClick={() => setFilterSource('form')}>Form</button>
                  <button className={`filter-btn ${filterSource === 'popup' ? 'active' : ''}`} onClick={() => setFilterSource('popup')}>Popup</button>
                </div>

                <label className="section-title-xs">Filter by Contact Type</label>
                <div className="source-filter-bar mb-2">
                  <button className={`filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All</button>
                  <button className={`filter-btn ${filterType === 'phone' ? 'active' : ''}`} onClick={() => setFilterType('phone')}>Phone</button>
                  <button className={`filter-btn ${filterType === 'both' ? 'active' : ''}`} onClick={() => setFilterType('both')}>Both</button>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsReplied}
                    disabled={actionStatus === 'processing'}
                    className="button-primary mt-2"
                  >
                    MARK ALL REPLIED
                  </button>
                )}
              </div>
            </div>

            <div className="admin-panel">
              <h3 className="section-title">INQUIRY MESSAGES</h3>
              <div className="messages-list">
                {filteredQueries.length === 0 && !isDataLoading ? (
                  <p className="text-center py-4 text-muted">No {filterSource !== 'all' ? filterSource : ''} messages yet.</p>
                ) : (
                  filteredQueries.map((q) => (
                    <div key={q.id} className={`message-card ${q.isSeen ? 'seen' : 'unseen'}`}>
                      <div className="message-header">
                        <div className="header-left">
                          <h4 className="name-title">
                            {q.name}
                            {!q.isSeen && <span className="new-tag">NEW</span>}
                            {q.source === 'popup' ? (
                              <span className="source-tag popup">POPUP</span>
                            ) : q.source === 'form' ? (
                              <span className="source-tag form">FORM</span>
                            ) : (
                              q.phone && <span className="source-tag call">CALL</span>
                            )}
                          </h4>
                          <div className="contact-info">
                            {q.email && q.email !== 'Not provided' && (
                              <span className="email" title={q.email} style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.email}</span>
                                <button className="copy-badge" onClick={() => copyToClipboard(q.email)} title="Copy Email">
                                  <CopyIcon />
                                </button>
                              </span>
                            )}
                            {q.phone && q.phone.trim() !== '' && (
                              <span className="phone-highlight" style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.phone}</span>
                                <button className="copy-badge" onClick={() => copyToClipboard(q.phone)} title="Copy Phone">
                                  <CopyIcon />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="message-actions">
                          <span className="date">
                            {q.createdAt?.toDate ? q.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </span>
                          <div className="action-btns">
                            {q.isSeen ? (
                              <button className="action-btn-pro" disabled>
                                This one was replied
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMarkAsReplied(q.id)}
                                disabled={actionStatus === 'processing'}
                                className="action-btn-pro"
                                title="Mark as handled"
                              >
                                Mark this as replied
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteQuery(q.id)}
                              disabled={actionStatus === 'processing'}
                              className="action-btn-pro delete"
                              title="Delete message"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className="message-body"
                        title={q.isSeen ? "Already Replied" : (q.email && q.email !== 'Not provided' ? "Click to Reply via Gmail" : "Phone Only Contact")}
                        style={{
                          cursor: (!q.isSeen && q.email && q.email !== 'Not provided') ? 'pointer' : 'default',
                          opacity: q.isSeen ? 0.7 : 1,
                          position: 'relative'
                        }}
                      >
                        <p>{q.message}</p>
                        {!q.isSeen && q.email && q.email !== 'Not provided' && (
                          <div className="reply-hint">Reply via Gmail →</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          : activeTab === 'users' ? (
            <div className="admin-grid">
              <div className="admin-panel glass-card p-2">
                <h3 className="left-panel-title">AUTHORIZE STAFF</h3>
                <p className="small text-muted mb-2">Authorized emails can manage the portfolio after logging in with Google.</p>
                <form onSubmit={handleAddAdmin} className="admin-form">
                  <div className="form-group mb-1">
                    <label className="section-title-xs">AUTHORIZE EMAIL</label>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="modern-input"
                    />
                  </div>
                  <button type="submit" className="button-primary w-100" disabled={actionStatus === 'processing'}>
                    Authorize Email
                  </button>
                </form>
              </div>

              <div className="admin-panel">
                <h3 className="section-title">STAFF & PERMISSIONS</h3>
                <div className="role-section mb-3">
                  <h4 className="left-panel-title" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>SUPER ADMINISTRATORS</h4>
                  <p className="small text-muted mb-2">System owners with full dashboard permissions. Managed in Firestore.</p>
                  <div className="user-grid">
                    {superAdmins.map(email => (
                      <div key={email} className="user-pro-card super">
                        <div className="user-icon"></div>
                        <div className="user-info">
                          <strong>{email}</strong>
                          <span className="pro-badge">Superadmin</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="role-section">
                  <h4 className="left-panel-title" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>AUTHORIZED STAFF</h4>
                  <p className="small text-muted mb-2">Manage authorized administrators with standard permissions.</p>

                  <div style={{ display: 'flex', alignItems: 'stretch', gap: '2rem', flexWrap: 'wrap' }}>
                    <div className="table-wrapper glass-card" style={{ maxWidth: '720px', flex: '1 1 500px' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Email Address</th>
                            <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminList.filter(email => !superAdmins.includes(email)).map((email) => (
                            <tr key={email}>
                              <td>{email}</td>
                              <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                                <button
                                  onClick={() => handleRemoveAdmin(email)}
                                  disabled={actionStatus === 'processing'}
                                  className="action-btn-pro delete"
                                  title="Revoke Access"
                                >
                                  REVOKE
                                </button>
                              </td>
                            </tr>
                          ))}
                          {adminList.filter(email => !superAdmins.includes(email)).length === 0 && (
                            <tr><td colSpan="2" className="text-center py-2 text-muted">No additional admins authorized.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="security-note-box">
                      <div className="security-header">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 4.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5zm1 10h-2v-6h2v6z" /></svg>
                        <span>SECURITY POLICY</span>
                      </div>
                      <p>To change a <strong>Superuser</strong> contact the developers. For security reasons, you cannot modify system owners through this dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'settings' ? (
            <div className="admin-grid">
              <div className="admin-panel glass-card p-2">
                <h3 className="left-panel-title">CONFIGURATION</h3>
                <p className="small text-muted mb-1">Manage global website information.</p>

                <div className="admin-form">
                  <div className="admin-help-box">
                    <div className="help-header">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z" /></svg>
                      <span>INTEGRATION GUIDE</span>
                    </div>
                    <ul className="help-steps">
                      <li>1. Go to <strong>Google Maps</strong></li>
                      <li>2. Click <strong>Share</strong> → <strong>Embed a map</strong></li>
                      <li>3. Copy ONLY the <code>src="..."</code> URL</li>
                    </ul>
                  </div>
                </div>

                <form onSubmit={handleUpdateMap} className="admin-form">
                  <div className="form-group mb-2">
                    <label className="section-title-xs">PHYSICAL OFFICE ADDRESS</label>
                    <input
                      type="text"
                      placeholder="Street, City, Zip"
                      required
                      value={mapAddress}
                      onChange={(e) => setMapAddress(e.target.value)}
                      className="modern-input"
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label className="section-title-xs">GOOGLE MAPS EMBED URL</label>
                    <textarea
                      rows="4"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      required
                      value={mapUrl}
                      onChange={(e) => setMapUrl(e.target.value)}
                      className="modern-textarea"
                    />
                  </div>

                  <button type="submit" className="button-primary w-100" disabled={actionStatus === 'processing'}>
                    {actionStatus === 'processing' ? 'SAVING...' : 'UPDATE MAP SETTINGS'}
                  </button>
                </form>
              </div>

              <div className="admin-panel glass-card p-2">
                <h3 className="section-title">SITE SETTINGS</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="small text-muted">How map looks on the website.</p>
                  <div className="shape-toggles">
                    <button
                      className={`shape-btn ${mapShape === 'rectangle' ? 'active' : ''}`}
                      onClick={() => setMapShape('rectangle')}
                      title="Rectangle View"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="10" rx="0"></rect></svg>
                    </button>
                    <button
                      className={`shape-btn ${mapShape === 'square' ? 'active' : ''}`}
                      onClick={() => setMapShape('square')}
                      title="Square View"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="0"></rect></svg>
                    </button>
                  </div>
                </div>
                <div className={`map-preview-container ${mapShape}`}>
                  {mapUrl ? (
                    <iframe src={mapUrl} title="Map Preview" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted">No map configured</div>
                  )}
                </div>
                <div className="admin-panel glass-card p-2" style={{ marginTop: '1.5rem' }}>
                  <h3 className="section-title">THEME PRESETS</h3>
                  <p className="small text-muted mb-2">Change the visual atmosphere of the dashboard.</p>

                  <div className="theme-grid">
                    {Object.keys(THEME_MAP).map(key => (
                      <button
                        key={key}
                        className={`theme-swatch ${themeKey === key ? 'active' : ''}`}
                        onClick={() => {
                          setThemeKey(key);
                          localStorage.setItem('adm-theme', key);
                        }}
                      >
                        {THEME_MAP[key].isExperimental && (
                          <span className="experimental-tag-mini">BETA</span>
                        )}
                        <div className="swatch-colors">
                          <div className="swatch-main" style={{ background: THEME_MAP[key].primary }}></div>
                          <div className="swatch-bg" style={{ background: THEME_MAP[key].bgMain }}></div>
                          <div className="swatch-card" style={{ background: THEME_MAP[key].bgCard }}></div>
                        </div>
                        <span className="theme-name">{THEME_MAP[key].name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-muted">Select a tab from the navigation above.</p>
            </div>
          )}
      {/* Custom Professional Modal */}
      {modalConfig.isOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{modalConfig.title}</h3>
            </div>
            <div className="admin-modal-body">
              <p>{modalConfig.message}</p>
            </div>
            <div className="admin-modal-footer">
              <button className="action-btn-pro" onClick={closeModal}>
                {modalConfig.type === 'confirm' ? 'CANCEL' : 'CLOSE'}
              </button>
              {modalConfig.type === 'confirm' && (
                <button
                  className="button-primary"
                  style={{ padding: '0.4rem 1.2rem', marginLeft: '0.75rem' }}
                  onClick={() => {
                    if (modalConfig.onConfirm) modalConfig.onConfirm();
                    closeModal();
                  }}
                >
                  CONFIRM
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard-page { 
          height: 100vh; 
          display: flex;
          flex-direction: column;
          background: var(--adm-bg);
          color: var(--adm-text);
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
        }

        /* Modal Styles */
        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: adminFadeIn 0.2s ease-out;
        }
        .admin-modal-content {
          background: var(--adm-card);
          border: 2px solid var(--adm-text);
          box-shadow: 8px 8px 0px var(--adm-text);
          width: 90%;
          max-width: 400px;
          padding: 1.5rem;
          animation: adminScaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .admin-modal-header h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--adm-text);
        }
        .admin-modal-body p {
          margin: 0 0 1.5rem 0;
          font-size: 0.9rem;
          color: var(--adm-muted);
          line-height: 1.5;
        }
        .admin-modal-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        @keyframes adminFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes adminScaleUp {
          from { transform: scale(0.95) translateY(10px); }
          to { transform: scale(1) translateY(0); }
        }

        /* Custom Professional Scrollbar */
        .admin-dashboard-page ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .admin-dashboard-page ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .admin-dashboard-page ::-webkit-scrollbar-thumb {
          background: var(--adm-text);
          border-radius: 0;
        }
        .admin-dashboard-page ::-webkit-scrollbar-thumb:hover {
          background: var(--adm-p);
        }
        
        /* Firefox Support */
        .admin-dashboard-page {
          scrollbar-width: thin;
          scrollbar-color: var(--adm-text) var(--adm-bg);
        }
        
        .admin-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          border-bottom: 2px solid var(--adm-text);
          background: var(--adm-card);
          padding: 0.75rem 2rem;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .logo-box {
          background: var(--adm-text);
          color: white;
          padding: 0.2rem 0.5rem;
          font-size: 1.1rem;
          border-radius: var(--adm-rad);
        }

        .logo-text {
          font-size: 1rem;
          color: var(--adm-text);
          text-transform: uppercase;
        }
        
        .admin-nav-main {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .admin-tabs { display: flex; gap: 0; border: 1px solid var(--adm-text); }
        .source-filter-bar { 
          display: flex; 
          border: 1px solid #ddd; 
          padding: 0; 
          border-radius: var(--adm-rad); 
          width: fit-content;
          overflow: hidden;
          margin-bottom: 0.75rem;
          background: white;
        }
        .filter-btn { 
          padding: 0.4rem 0.9rem; 
          font-size: 0.75rem; 
          background: white; 
          border: none; 
          border-right: 1px solid #ddd; 
          font-weight: 500;
          text-transform: uppercase;
          color: #666;
          cursor: pointer;
        }
        .filter-btn.active { 
          background: var(--adm-h-light); 
          color: var(--adm-text); 
          font-weight: 700;
          position: relative;
        }
        .filter-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--adm-p);
        }

        .left-panel-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--adm-text);
          margin-bottom: 0.25rem;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .tab-btn { 
          background: none; 
          border: none; 
          border-right: 1px solid var(--adm-text);
          padding: 0.5rem 1.25rem; 
          cursor: pointer; 
          font-weight: 700; 
          color: var(--adm-text); 
          font-size: 0.75rem;
          text-transform: uppercase;
          border-radius: var(--adm-rad);
        }
        .tab-btn:last-child { border-right: none; }
        .tab-btn:hover { background: #f1f1f1; }
        .tab-btn.active { 
          background: var(--adm-p); 
          color: white; 
          border-color: var(--adm-p) !important;
          box-shadow: 2px 2px 0px var(--adm-p-l);
        }
        .tab-btn.active .new-tag { background: white; color: var(--adm-p); }
        
        .filter-btn.active { background: var(--adm-text) !important; color: white !important; }
        .filter-btn:hover:not(.active) { background: #f0f0f0; }
        
        .admin-grid { 
          display: grid; 
          grid-template-columns: 380px 1fr; 
          gap: 0; 
          flex: 1;
          min-height: 0; 
          border-bottom: 2px solid var(--adm-text);
        }

        .admin-panel {
          background: var(--adm-card);
          padding: 2rem;
          overflow-y: auto;
          height: 100%;
        }
        
        .admin-panel:first-child {
          border-right: 2px solid var(--adm-text);
          background: var(--adm-bg);
          scrollbar-gutter: stable;
        }
        
        .admin-panel:first-child .admin-form {
          max-width: 320px; 
        }

        .glass-card { 
          background: var(--adm-card); 
          border: 1px solid var(--adm-text); 
          border-radius: var(--adm-rad); 
          box-shadow: 6px 6px 0px var(--adm-text); 
        }

        .section-title { 
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem; 
          text-transform: uppercase;
          background: var(--adm-text);
          color: white;
          padding: 0.4rem 0.8rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          font-weight: 700;
        }

        .user-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; }
        .user-pro-card {
          background: var(--adm-card); 
          border: 1px solid var(--adm-text); 
          padding: 1rem; 
          border-radius: var(--adm-rad);
          display: flex; align-items: center; gap: 1rem;
        }
        .user-pro-card.super { background: var(--adm-rep-bg); border: 2px solid var(--adm-p); }
        .user-icon { font-size: 1.25rem; }
        .user-info { display: flex; flex-direction: column; }
        .pro-badge { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; color: var(--adm-p); margin-top: 0.1rem; }
        
        .modern-input, .modern-textarea {
          display: block;
          width: 100%; 
          border: 1px solid var(--adm-text); 
          padding: 0.75rem; 
          border-radius: var(--adm-rad); 
          font-family: inherit; 
          font-size: 0.95rem;
          background: var(--adm-card);
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .modern-textarea {
          resize: vertical;
          min-height: 80px;
        }
        .modern-input::file-selector-button {
          border-radius: 0;
          border: 1px solid var(--adm-text);
          background: white;
          padding: 0.2rem 0.5rem;
          margin-right: 0.5rem;
          cursor: pointer;
          font-family: inherit;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.7rem;
        }
        .modern-input:focus { outline: none; border-color: var(--adm-p); }
        
        .admin-table { width: 100%; border-collapse: collapse; overflow: hidden; }
        .admin-table th { 
          text-align: left; 
          padding: 1rem 1.25rem; 
          background: var(--adm-text); 
          color: white; 
          font-size: 0.75rem; 
          text-transform: uppercase; 
          font-weight: 800; 
          letter-spacing: 0.1em;
        }
        .admin-table td {
          padding: 1rem; 
          border-bottom: 1px solid var(--adm-border-l); 
          font-size: 0.85rem; 
          background: var(--adm-card);
          transition: background 0.15s;
        }
        .admin-table tr:nth-child(even) td {
          background: #fafafa;
        }
        .admin-table tr:hover td {
          background: #f5f5f5;
        }
        .admin-table tr:last-child td {
          border-bottom: none;
        }
        
        .action-btn.pro, .action-btn-pro {
          background: #f5f5f5; 
          color: var(--adm-text); 
          border: 1px solid var(--adm-border-m); 
          padding: 0.35rem 0.75rem; 
          font-size: 0.7rem; 
          font-weight: 800; 
          cursor: pointer; 
          text-transform: uppercase;
          border-radius: var(--adm-rad);
          transition: all 0.1s;
        }
        .action-btn.pro:hover:not(:disabled), .action-btn-pro:hover:not(:disabled) { 
          background: var(--adm-text); 
          color: white; 
          border-color: var(--adm-text);
        }
        .action-btn.pro:disabled, .action-btn-pro:disabled {
          opacity: 0.5;
          cursor: default;
          background: #fdfdfd;
          color: #999;
          border-color: var(--adm-border-l);
        }
        
        .action-btn.pro.delete, .action-btn-pro.delete {
          color: var(--adm-del);
        }
        .action-btn.pro.delete:hover, .action-btn-pro.delete:hover {
          background: var(--adm-del);
          color: white;
          border-color: var(--adm-del);
        }

        .security-note-box {
          flex: 0 1 320px;
          background: #fff8f8;
          border: 1px solid var(--adm-text);
          padding: 1.5rem;
          border-left: 4px solid var(--adm-del);
          border-radius: 0px;
          box-shadow: 6px 6px 0px var(--adm-text);
          display: flex;
          flex-direction: column;
        }
        .security-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--adm-del);
          font-weight: 900;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }
        .security-note-box p {
          margin: 0;
          font-size: 0.8rem;
          line-height: 1.6;
          color: #666;
        }
        .security-note-box strong {
          color: var(--adm-text);
        }

        .admin-dashboard-page .button-primary { 
          background: var(--adm-p) !important; 
          color: white !important; 
          padding: 0.85rem 1.5rem; 
          border: none; 
          font-weight: 800; 
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer; 
          transition: all 0.1s;
          font-size: 0.8rem;
          border-radius: var(--adm-rad);
        }
        .admin-dashboard-page .button-primary:hover { 
          background: var(--adm-text) !important;
          transform: translate(-2px, -2px); 
          box-shadow: 4px 4px 0px var(--adm-p-l); 
        }
        .admin-dashboard-page .button-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .messages-list { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .message-card { 
          background: var(--adm-card); 
          border: 1px solid var(--adm-text); 
          transition: transform 0.1s;
          border-radius: var(--adm-rad);
        }
        .message-card.unseen { border-left: 6px solid var(--adm-p); }
        .message-card.seen { 
          background: var(--adm-rep-bg); 
          border-color: #ddd; 
          opacity: 0.8; 
          filter: grayscale(0.6);
        }
        .message-card.seen .message-body { background: var(--adm-rep-body); opacity: 0.5; }
        .message-card.seen .message-header { opacity: 1; }
        .message-card.seen .copy-badge { opacity: 0.6; }
        .message-card.seen .action-btn-pro:not(.delete) { color: #333; border-color: var(--adm-rep-border); font-weight: 800; }
        .message-card.seen .action-btn-pro.delete { opacity: 1; }
        .message-header { display: flex; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--adm-border-m); align-items: flex-end; }
        .name-title { margin: 0 0 0.4rem 0; color: var(--adm-text); font-weight: 800; font-size: 1rem; }
        .contact-info { display: flex; flex-direction: column; gap: 0.25rem; color: var(--adm-muted); font-size: 0.8rem; }
        .message-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }
        .action-btns { display: flex; gap: 0.5rem; }
        .message-body { padding: 1rem 1.25rem; background: var(--adm-bg); position: relative; font-size: 0.9rem; border-radius: 0; }
        
        .replied-tag { background: var(--adm-rep-bg); color: var(--adm-muted); font-size: 0.55rem; padding: 0.15rem 0.4rem; font-weight: 900; border: 1px solid var(--adm-border-l); border-radius: var(--adm-rad); margin-left: 0.75rem; vertical-align: middle; }
        .new-tag { 
          background: var(--adm-new-bg); 
          color: var(--adm-new-t); 
          font-size: 0.55rem; 
          padding: 0.15rem 0.4rem; 
          font-weight: 950; 
          border: 1px solid var(--adm-new-t);
          border-radius: var(--adm-rad); 
          margin-left: 0.5rem; 
          vertical-align: middle; 
          text-transform: uppercase;
          box-shadow: 2px 2px 0px rgba(0,0,0,0.05);
        }
        
        .source-tag { font-size: 0.55rem; font-weight: 900; padding: 0.15rem 0.4rem; margin-left: 0.5rem; border: 1px solid var(--adm-text); color: var(--adm-text); border-radius: var(--adm-rad); vertical-align: middle; }
        .source-tag.popup { border-color: var(--adm-pop); color: var(--adm-pop); background: var(--adm-pop-bg); }
        .source-tag.form { border-color: var(--adm-form); color: var(--adm-form); background: var(--adm-form-bg); }
        .source-tag.call { border-color: var(--adm-call); color: var(--adm-call); background: var(--adm-call-bg); }
        
        .copy-badge {
          background: #eee;
          color: #666;
          padding: 3px;
          margin-left: 6px;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          border: 1px solid transparent;
        }
        .copy-badge svg { width: 10px; height: 10px; }
        .copy-badge:hover { background: var(--adm-p); color: white; border-color: var(--adm-p); }
        .copy-badge:active { transform: scale(0.9); }

        .italic { font-style: italic; }
        .gap-1 { gap: 0.5rem; }

        .section-title-xs {
          font-size: 0.6rem;
          font-weight: 900;
          text-transform: uppercase;
          color: var(--adm-text);
          letter-spacing: 0.08em;
          margin-bottom: 0.4rem;
          display: block;
        }
        
        .admin-help-box {
          background: #fcfcfc; 
          border: 1px solid var(--adm-text);
          border-left: 4px solid var(--adm-p);
          padding: 1.25rem;
          margin-bottom: 1.25rem;
        }
        .help-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--adm-p);
          font-weight: 900;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }
        .help-steps {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .help-steps li {
          font-size: 0.8rem;
          color: var(--adm-muted);
          margin-bottom: 0.4rem;
          line-height: 1.4;
        }
        .help-steps li:last-child { margin-bottom: 0; }
        .help-steps code {
          background: #eee;
          padding: 0.1rem 0.3rem;
          color: var(--adm-text);
          font-weight: 600;
        }

        .map-preview-container { 
          background: var(--adm-bg); 
          border: 1px solid var(--adm-text); 
          margin: 1rem auto 0; 
          border-radius: var(--adm-rad);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          display: block;
        }
        .map-preview-container.rectangle { width: 100%; height: 280px; }
        .map-preview-container.square { width: 450px; height: 450px; }

        .shape-toggles { display: flex; gap: 0.5rem; }
        .shape-btn {
          background: none;
          border: 1px solid var(--adm-border-m);
          padding: 4px;
          cursor: pointer;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .shape-btn svg { width: 16px; height: 16px; }
        .shape-btn.active { border-color: var(--adm-p); color: var(--adm-p); background: var(--adm-rep-bg); }
        .shape-btn:hover:not(.active) { border-color: var(--adm-text); color: var(--adm-text); }

        .project-thumbnail-large {
          width: 100px;
          height: 70px;
          border: 1px solid var(--adm-text);
          background: #eee;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 4px 4px 0px var(--adm-border-l);
        }
        .project-thumbnail-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .order-controls {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .order-btn {
          background: var(--adm-card);
          border: 1px solid var(--adm-border-m);
          color: var(--adm-text);
          font-size: 0.6rem;
          padding: 2px 4px;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 0;
        }
        .order-btn:hover:not(:disabled) { background: var(--adm-p); color: white; border-color: var(--adm-p); }
        .order-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .gmail-reply-link {
          color: var(--adm-p);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          display: inline-flex;
        }

        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 1rem;
        }
        .theme-swatch {
          position: relative;
          background: var(--adm-bg);
          border: 1px solid var(--adm-border-m);
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
          overflow: hidden;
        }
        .theme-swatch:hover {
          border-color: var(--adm-p);
          transform: translateY(-2px);
        }
        .theme-swatch.active {
          border-color: var(--adm-p);
          border-width: 2px;
          background: var(--adm-card);
          box-shadow: 4px 4px 0px var(--adm-p);
        }
        .theme-name {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--adm-muted);
          letter-spacing: 0.05em;
        }
        .experimental-tag-mini {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--adm-p);
          color: white;
          font-size: 7px;
          font-weight: 900;
          padding: 1px 5px;
          border-bottom-left-radius: 4px;
          letter-spacing: 0.05em;
          z-index: 2;
          box-shadow: -1px 1px 2px rgba(0,0,0,0.2);
        }
        .swatch-colors {
          height: 40px;
          display: flex;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .swatch-main { flex: 1.5; }
        .swatch-bg { flex: 1; }
        .swatch-card { flex: 1; }
        .reply-hint {
          color: var(--adm-p);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.6rem;
          transition: opacity 0.2s;
          cursor: pointer;
        }
        .reply-hint:hover { opacity: 0.8; text-decoration: underline; }

        .menu-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; z-index: 1001; align-items: center; justify-content: center; }
        .hamburger { 
          width: 22px; 
          height: 16px; 
          position: relative; 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between; 
          transition: none !important;
        }
        .hamburger span { 
          display: block; 
          height: 2px; 
          width: 100%; 
          background: var(--adm-text); 
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s !important; 
          border-radius: 1px;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        @media (max-width: 1100px) {
          .admin-grid { grid-template-columns: 1fr; overflow-y: auto; align-content: start; }
          .admin-panel { height: auto; overflow: visible; padding: 1.5rem 1.25rem !important; }
          .admin-panel:first-child { border-right: none; border-bottom: 2px solid var(--adm-text); padding-bottom: 0.75rem !important; }
          .admin-panel:last-child { padding-top: 1rem !important; }
        }

        @media (max-width: 850px) {
          .admin-header { padding: 0.8rem 1.25rem; display: flex; align-items: center; justify-content: space-between; }
          .admin-logo .logo-box { font-size: 0.9rem; padding: 0.15rem 0.4rem; }
          .admin-logo .logo-text { display: none; }
          .menu-toggle { display: flex; margin-right: 0; order: -1; }
          
          .nav-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.3); backdrop-filter: blur(3px);
            z-index: 999; animation: adminFadeIn 0.2s;
          }

          .admin-nav-main {
            position: fixed; top: 0; left: 0; bottom: 0; width: 60%;
            height: 100vh; background: var(--adm-card); 
            border-right: 2px solid var(--adm-text);
            flex-direction: column; align-items: stretch; justify-content: flex-start;
            padding: 4rem 1.25rem 1.5rem; gap: 1.5rem; z-index: 1000;
            transform: translateX(-100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 10px 0px 30px rgba(0,0,0,0.1);
          }
          .admin-nav-main.mobile-open { transform: translateX(0); }
          
          .admin-tabs { flex-direction: column; width: 100%; border: none; gap: 0.6rem; overflow-y: auto; margin-bottom: 1.5rem; }
          .tab-btn { 
            width: 100%; text-align: left; padding: 0.75rem 1rem; 
            font-size: 0.8rem; border: 1.5px solid var(--adm-text) !important;
            box-shadow: 3px 3px 0px var(--adm-text);
            background: white;
            font-weight: 800;
          }
          .tab-btn.active { transform: translate(1.5px, 1.5px); box-shadow: 1px 1px 0px var(--adm-text); }
          .action-btn.pro { 
            width: 100%; padding: 0.75rem; font-size: 0.85rem; 
            border: 1.5px solid var(--adm-del); color: var(--adm-del); 
            background: white; font-weight: 900;
            margin-top: auto;
          }
          
          .section-title { 
            font-size: 0.85rem !important; 
            padding: 0.35rem 0.7rem !important; 
            margin-bottom: 0.85rem !important; 
          }
          .left-panel-title {
            font-size: 0.9rem !important;
            font-weight: 800;
            color: var(--adm-text);
            margin-bottom: 0.5rem !important;
            margin-top: 0 !important;
            display: block;
          }
          .section-subtitle, .small.text-muted { 
            font-size: 0.68rem !important; 
            margin-bottom: 1.25rem; 
            opacity: 0.7; 
            line-height: 1.4; 
          }
          
          /* MESSAGES & PROJECTS CARDS */
          .message-card { margin-bottom: 0.75rem; border-radius: 4px; }
          .message-header { 
            padding: 0.75rem 0.85rem !important; 
            gap: 0.5rem !important; 
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            background: #fafafa;
            border-bottom: 1px solid #eee;
          }
          .header-left { flex: 1; min-width: 0; opacity: 0.75; }
          .name-title { width: 100%; font-size: 0.75rem !important; margin-bottom: 0.2rem !important; }
          .contact-info { 
            width: 100%;
            gap: 0.15rem; 
            font-size: 0.65rem !important; 
          }
          .message-actions { 
            align-items: flex-end;
            gap: 0.35rem;
          }
          .message-actions .date { font-size: 0.6rem !important; opacity: 0.6; margin-bottom: 0.25rem; }
          .message-body { 
            padding: 1.15rem 0.85rem !important; 
            font-size: 0.95rem !important; 
            line-height: 1.6; 
            color: var(--adm-text); 
            background: white !important;
            font-weight: 500;
          }
          .action-btns .action-btn-pro { padding: 0.4rem 0.6rem !important; font-size: 0.65rem !important; }
          .reply-link { font-size: 0.75rem !important; margin-top: 1rem !important; opacity: 0.9; }
          
          .project-thumbnail-large { width: 80px; height: 55px; box-shadow: 2px 2px 0px var(--adm-border-l); }
          .badge-pro { font-size: 0.55rem; padding: 0.1rem 0.3rem; }
          .new-tag, .source-tag { font-size: 0.5rem; padding: 0.1rem 0.3rem; }
          
          /* TABLES & USERS */
          .user-pro-card { padding: 0.6rem 0.85rem; margin-bottom: 0.4rem; gap: 0.75rem; }
          .user-info strong { font-size: 0.8rem; }
          .pro-badge { font-size: 0.5rem; }
          .admin-table td, .admin-table th { padding: 0.6rem 0.75rem !important; font-size: 0.75rem !important; }
          
          .security-note-box { 
            width: 100% !important; 
            max-width: none !important;
            box-sizing: border-box !important; 
            margin: 1rem 0 !important; 
            padding: 0.85rem !important; 
            box-shadow: 4px 4px 0px var(--adm-text) !important;
            flex: none !important;
          }
          .table-wrapper { 
            width: 100% !important; 
            max-width: none !important;
            margin-bottom: 0.5rem !important; 
            box-sizing: border-box !important;
            flex: none !important; 
          }
          .admin-panel { padding: 1.25rem 1rem !important; box-shadow: none !important; }
          /* FORMS */
          .form-group { margin-bottom: 0.75rem; width: 100%; }
          .section-title-xs { font-size: 0.72rem !important; margin-bottom: 0.25rem !important; font-weight: 800 !important; }
          .modern-input, .modern-textarea { 
            width: 100% !important; 
            padding: 0.5rem; 
            font-size: 0.85rem; 
          }
          .button-primary { padding: 0.85rem 1rem !important; font-size: 0.85rem !important; box-shadow: none !important; transform: none !important; }
          
          .map-preview-container.rectangle, .map-preview-container.square { 
            width: calc(100% + 1.5rem) !important; 
            margin-left: -0.75rem !important;
            margin-right: -0.75rem !important;
            aspect-ratio: 1 / 1 !important;
            height: auto !important;
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
          .admin-panel.glass-card { box-shadow: none !important; border: 1px solid var(--adm-border-m); }
          .admin-panel.glass-card + .admin-panel.glass-card { margin-top: 1rem !important; }
          .button-primary { 
            padding: 0.85rem 1rem !important; 
            font-size: 0.85rem !important; 
            box-shadow: none !important;
            transform: none !important;
          }

          /* SETTINGS SPECIFIC */
          .shape-toggles { display: none !important; }
          .theme-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 0.75rem !important; 
          }
          .theme-swatch { padding: 0.5rem !important; }
          .theme-name { font-size: 0.65rem !important; }

          /* FILTER GROUPS DENSITY */
          .filter-manager { display: flex; flex-direction: column; gap: 0.2rem; align-items: flex-start; width: 100%; }
          .filter-manager .modern-input { width: 80% !important; margin-bottom: 0.5rem; }
          .source-filter-bar { 
            width: 80% !important; 
            display: flex; 
            box-shadow: none;
            border-color: #eee;
            margin-bottom: 0.4rem !important;
            background: #fff;
          }
          .filter-btn { 
            flex: 1;
            padding: 0.45rem 0.6rem !important; 
            font-size: 0.7rem !important; 
            text-align: center;
            border-right: 1px solid #eee;
            color: #888 !important;
            background: transparent !important;
          }
          .filter-btn.active { 
            background: var(--adm-h-light) !important; 
            color: var(--adm-text) !important; 
            font-weight: 800 !important;
          }
          .filter-btn:last-child { border-right: none; }
          .filter-manager .section-title-xs { margin-bottom: 0.1rem !important; opacity: 0.6; }
        }

        @media (max-width: 480px) {
          .admin-nav-main { width: 80%; padding-top: 3.5rem; }
          .admin-panel { padding: 1.25rem 0.5rem !important; box-shadow: none !important; }
          .section-title, .left-panel-title { font-size: 1rem !important; }
          .section-title-xs { font-size: 0.75rem !important; }
          .section-subtitle, .small.text-muted { font-size: 0.8rem !important; }
          .user-info strong { font-size: 0.75rem; }
          .map-preview-container.rectangle, .map-preview-container.square { height: 220px !important; }
          .button-primary, .action-btn-pro { box-shadow: none !important; }
        }
        
        /* Force remove rounding for any button in admin dashboard */
        .admin-dashboard-page button {
          border-radius: var(--adm-rad) !important;
        }
      `}</style>


    </div>
  );
};

export default AdminDashboard;
