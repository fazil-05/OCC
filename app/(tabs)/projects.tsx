import { OccScreenScaffold } from '@/components/occ/OccScreenScaffold';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

type ProjectStatus = 'ACTIVE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  type: string;
  payout: string;
  appliedDate: string;
  tasks?: ProjectTask[];
}

interface ProjectTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    title: 'Visual Identity Design',
    client: 'Action Studio',
    status: 'ACCEPTED',
    type: 'Creative',
    payout: '₹4,500',
    appliedDate: 'Apr 02, 2026',
    tasks: [
      { id: 't1', title: 'Typography Guide Submission', isCompleted: true },
      { id: 't2', title: 'Logo Variable Prototypes', isCompleted: false },
      { id: 't3', title: 'Color System Calibration', isCompleted: false },
    ]
  },
  {
    id: '2',
    title: 'Deep-Tech Content Lead',
    client: 'OCC Hub',
    status: 'PENDING',
    type: 'Technical',
    payout: '₹12,000',
    appliedDate: 'Apr 04, 2026',
  },
  {
    id: '3',
    title: 'Event Management Associate',
    client: 'Global Music',
    status: 'REJECTED',
    type: 'Management',
    payout: '₹3,000',
    appliedDate: 'Mar 28, 2026',
  },
  {
    id: '4',
    title: 'Social Media Curator',
    client: 'Trend Lab',
    status: 'ACCEPTED',
    type: 'Marketing',
    payout: '₹6,000',
    appliedDate: 'Apr 01, 2026',
    tasks: [
      { id: 'st1', title: 'Easter Campaign Captions', isCompleted: true },
      { id: 'st2', title: 'Visual Grid Alignment', isCompleted: true },
      { id: 'st3', title: 'Drafting 5 Core Videos', isCompleted: false },
    ]
  }
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'ALL' | ProjectStatus>('ALL');

  const filteredProjects = PROJECTS_DATA.filter(p => filter === 'ALL' || p.status === filter);

  const renderStatusBadge = (status: ProjectStatus) => {
    let color = '#94A3B8';
    let bgColor = '#F1F5F9';

    if (status === 'ACCEPTED') { color = '#10B981'; bgColor = '#ECFDF5'; }
    if (status === 'REJECTED') { color = '#EF4444'; bgColor = '#FEF2F2'; }
    if (status === 'PENDING') { color = '#F59E0B'; bgColor = '#FFFBEB'; }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
        <Text style={[styles.statusText, { color }]}>{status}</Text>
      </View>
    );
  };

  const renderProjectCard = ({ item }: { item: Project }) => (
    <View style={styles.projectCard}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.typeRow}>
            <Text style={styles.projectType}>{item.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.projectTitle}>{item.title}</Text>
          <Text style={styles.clientName}>{item.client}</Text>
          <View style={{ marginTop: 10 }}>
            {renderStatusBadge(item.status)}
          </View>
        </View>
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Feather name="calendar" size={12} color="#94A3B8" />
          <Text style={styles.metaValue}>{item.appliedDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={[styles.metaValue, { color: '#10B981', fontFamily: 'InterBold' }]}>{item.payout}</Text>
        </View>
      </View>

      {item.status === 'ACCEPTED' && item.tasks && (
        <View style={styles.tasksSection}>
          <Text style={styles.tasksTitle}>ASSIGNED TASKS</Text>
          {item.tasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <Ionicons
                name={task.isCompleted ? "checkbox" : "square-outline"}
                size={16}
                color={task.isCompleted ? "#7C3AED" : "#94A3B8"}
              />
              <Text style={[styles.taskText, task.isCompleted && styles.completedTask]}>
                {task.title}
              </Text>
            </View>
          ))}
          <TouchableOpacity style={styles.viewTasksBtn}>
            <Text style={styles.viewTasksBtnText}>WORKSPACE ACCESS</Text>
            <Feather name="arrow-right" size={12} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <OccScreenScaffold title="Projects">
      <View style={styles.container}>

        {/* Poised Stats Summary */}
        <View style={styles.statsOverview}>
          <View style={styles.statMiniBox}>
            <Text style={styles.statMiniValue}>4</Text>
            <Text style={styles.statMiniLabel}>TOTAL</Text>
          </View>
          <View style={styles.statMiniBox}>
            <Text style={[styles.statMiniValue, { color: '#10B981' }]}>2</Text>
            <Text style={styles.statMiniLabel}>ACTIVE</Text>
          </View>
          <View style={styles.statMiniBox}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.statMiniValue, { color: '#7C3AED' }]}
            >
              ₹10.5K
            </Text>
            <Text style={styles.statMiniLabel}>PIPELINE</Text>
          </View>
        </View>

        {/* Filter Scroll */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.filterBtn, filter === f && styles.activeFilterBtn]}
              >
                <Text style={[styles.filterBtnText, filter === f && styles.activeFilterBtnText]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.projectList}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((item) => (
              <React.Fragment key={item.id}>
                {renderProjectCard({ item })}
              </React.Fragment>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="briefcase" size={48} color="#F1F5F9" />
              <Text style={styles.emptyText}>No projects in this pipeline.</Text>
            </View>
          )}
        </View>
      </View>
    </OccScreenScaffold>
  );
}

const styles = StyleSheet.create({
  projectsHeader: {
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: 'ArchivoHeavyItalic', // 900 BLACK ITALIC
    fontSize: 32,
    textTransform: 'uppercase',
    color: '#0F172A',
    letterSpacing: -1.4,
  },
  container: {
    flex: 1,
    marginTop: 10,
  },
  statsOverview: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statMiniBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
  },
  statMiniValue: {
    fontFamily: 'ArchivoHeavyItalic',
    fontSize: 18,
    color: '#0F172A',
  },
  statMiniLabel: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: '#94A3B8',
    letterSpacing: 1,
    marginTop: 4,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activeFilterBtn: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterBtnText: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: '#64748B',
    letterSpacing: 0.5,
  },
  activeFilterBtnText: {
    color: '#FFF',
  },
  projectList: {
    paddingBottom: 100,
    gap: 16,
  },
  projectCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  projectType: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: '#7C3AED',
    letterSpacing: 1,
    marginBottom: 4,
  },
  projectTitle: {
    fontFamily: 'ArchivoHeavyItalic',
    fontSize: 17,
    color: '#0F172A',
  },
  clientName: {
    fontFamily: 'InterSemi',
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start', // Anchors the badge to the left
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaValue: {
    fontFamily: 'InterSemi',
    fontSize: 11,
    color: '#64748B',
  },
  tasksSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  tasksTitle: {
    fontFamily: 'InterBold',
    fontSize: 9,
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 14,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  taskText: {
    fontFamily: 'InterSemi',
    fontSize: 13,
    color: '#334155',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  viewTasksBtn: {
    marginTop: 14,
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  viewTasksBtnText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: '#FFF',
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontFamily: 'InterSemi',
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 16,
  }
});